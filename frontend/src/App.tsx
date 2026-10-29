import React, { useState } from 'react';
import { Header } from './components/Header';
import { OverviewTab } from './components/OverviewTab';
import { CommentQueueTab } from './components/CommentQueueTab';
import { HumanReviewTab } from './components/HumanReviewTab';
import { ApproachTab } from './components/ApproachTab';
import { VideoInputModal } from './components/VideoInputModal';
import { BrowseVideosModal } from './components/BrowseVideosModal';
import { BottomPill } from './components/BottomPill';
import { INITIAL_COMMENTS, INITIAL_VIDEOS } from './data/initialData';
import { VideoComment, Category, ModeratorAction, ModeratorDecisionLog, VideoInfo } from './types';
import { X, Filter } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'queue' | 'review' | 'approach'>('overview');
  const [comments, setComments] = useState<VideoComment[]>(INITIAL_COMMENTS);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedVideo, setSelectedVideo] = useState<VideoInfo | null>(null);
  const [decisionLogs, setDecisionLogs] = useState<ModeratorDecisionLog[]>([]);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [isBrowseModalOpen, setIsBrowseModalOpen] = useState<boolean>(false);
  const [isRetraining, setIsRetraining] = useState<boolean>(false);
  const [retrainingToast, setRetrainingToast] = useState<string | null>(null);

  // Filter comments by selected video if active
  const filteredCommentsByVideo = selectedVideo
    ? comments.filter((c) => c.videoTitle.toLowerCase().includes(selectedVideo.title.toLowerCase()) || c.videoId === selectedVideo.id)
    : comments;

  // Review items: awaiting_review OR abusive policy review item
  const reviewQueueComments = comments.filter(
    (c) => c.status === 'awaiting_review' || (c.category === 'abusive' && c.status === 'hidden')
  );

  const handleModeratorAction = (
    commentId: string,
    action: ModeratorAction,
    overrideCategory?: Category
  ) => {
    const target = comments.find((c) => c.id === commentId);
    if (!target) return;

    let updatedStatus: VideoComment['status'] = 'published';
    let updatedActionDesc = 'Publish';
    let newCategory = overrideCategory || target.category;

    if (action === 'approve') {
      updatedStatus = 'published';
      updatedActionDesc = 'Published by Moderator';
      if (newCategory === 'unclear') newCategory = 'fine';
    } else if (action === 'hide') {
      updatedStatus = 'hidden';
      updatedActionDesc = 'Hidden by Moderator';
      if (newCategory === 'unclear' || newCategory === 'fine') newCategory = 'spam';
    } else if (action === 'escalate') {
      updatedStatus = 'escalated';
      updatedActionDesc = 'Escalated to Senior Safety Lead';
      newCategory = 'abusive';
    }

    // Update comment in state
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              category: newCategory,
              status: updatedStatus,
              proposedAction: updatedActionDesc,
              decisionBy: 'Moderator',
              recommendedActionDesc: `Moderator reviewed and executed: ${action.toUpperCase()}`
            }
          : c
      )
    );

    // Append to decision log (active learning dataset)
    const newLog: ModeratorDecisionLog = {
      id: `log-${Date.now()}`,
      commentId: target.id,
      commentText: target.text,
      author: target.author,
      originalCategory: target.category,
      newAction: action,
      timestamp: 'Just now',
      moderatorName: 'Dhanush (Moderator 1)',
      trainingSampleStatus: 'Active label queued for weekly model update'
    };

    setDecisionLogs((prev) => [newLog, ...prev]);
  };

  const handleRestoreComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              status: 'published',
              category: 'fine',
              proposedAction: 'Restored to Public Video',
              decisionBy: 'Moderator',
              recommendedActionDesc: 'Restored after false-positive appeal check.'
            }
          : c
      )
    );

    const target = comments.find((c) => c.id === commentId);
    if (target) {
      setDecisionLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          commentId: target.id,
          commentText: target.text,
          author: target.author,
          originalCategory: target.category,
          newAction: 'approve',
          timestamp: 'Just now',
          moderatorName: 'Appeal Desk',
          trainingSampleStatus: 'Marked as false-positive mislabel (high retraining weight)'
        },
        ...prev
      ]);
    }
  };

  const handleAddCustomComment = (newComment: VideoComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  const handleTriggerRetrainingSim = () => {
    setIsRetraining(true);
    setTimeout(() => {
      setIsRetraining(false);
      setRetrainingToast(
        'Retraining complete: 14 fresh moderator labels processed. DistilBERT weights updated. False positive rate improved to 1.9%!'
      );
      setTimeout(() => setRetrainingToast(null), 4000);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 font-sans flex flex-col selection:bg-amber-100 selection:text-amber-900">
      
      {/* Toast Notification */}
      {retrainingToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{retrainingToast}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenVideoModal={() => setIsVideoModalOpen(true)}
        reviewCount={reviewQueueComments.length}
      />

      {/* Active Video Filter Bar (if video is selected) */}
      {selectedVideo && activeTab === 'queue' && (
        <div className="bg-amber-100/70 border-b border-amber-200/80 px-4 sm:px-8 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-amber-800" />
              <span className="font-medium text-amber-900">
                Filtered by Video: <strong>{selectedVideo.title}</strong> ({selectedVideo.channel})
              </span>
            </div>
            <button
              onClick={() => setSelectedVideo(null)}
              className="text-[11px] font-bold text-amber-900 hover:text-black flex items-center gap-1 bg-white/70 px-2 py-0.5 rounded-lg border border-amber-300 transition-colors"
            >
              <X className="w-3 h-3" />
              Show All Videos
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-8 pt-6 pb-24">
        {activeTab === 'overview' && (
          <OverviewTab
            onNavigateToQueue={(cat) => {
              if (cat) setSelectedCategoryFilter(cat);
              setActiveTab('queue');
            }}
            onNavigateToReview={() => setActiveTab('review')}
            onNavigateToApproach={() => setActiveTab('approach')}
            queueCount={reviewQueueComments.length}
          />
        )}

        {activeTab === 'queue' && (
          <CommentQueueTab
            comments={filteredCommentsByVideo.length > 0 ? filteredCommentsByVideo : comments}
            selectedCategory={selectedCategoryFilter}
            setSelectedCategory={setSelectedCategoryFilter}
            onModeratorAction={handleModeratorAction}
            onRestoreComment={handleRestoreComment}
          />
        )}

        {activeTab === 'review' && (
          <HumanReviewTab
            reviewComments={reviewQueueComments}
            decisionLogs={decisionLogs}
            onModeratorAction={handleModeratorAction}
            onRestoreComment={handleRestoreComment}
            onTriggerRetrainingSim={handleTriggerRetrainingSim}
            isRetraining={isRetraining}
          />
        )}

        {activeTab === 'approach' && <ApproachTab />}
      </main>

      {/* Video Fetching and Test Modal */}
      <VideoInputModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onAddComment={handleAddCustomComment}
        onSelectVideo={(v: VideoInfo) => {
          setSelectedVideo(v);
          setSelectedCategoryFilter('all');
          setActiveTab('queue');
        }}
      />

      {/* Browse Videos Catalog Modal */}
      <BrowseVideosModal
        isOpen={isBrowseModalOpen}
        onClose={() => setIsBrowseModalOpen(false)}
        selectedVideoId={selectedVideo?.id || null}
        onSelectVideo={(v) => {
          setSelectedVideo(v);
          setActiveTab('queue');
        }}
        onOpenCommentForVideo={(v) => {
          setSelectedVideo(v);
          setIsVideoModalOpen(true);
        }}
        onIngestVideoComments={(newComments) => {
          setComments((prev) => [...newComments, ...prev]);
        }}
      />

      {/* Floating Bottom Pill matching screenshot */}
      <BottomPill
        activeView={activeTab}
        onOpenBrowse={() => setIsBrowseModalOpen(true)}
        onOpenTestComment={() => setIsVideoModalOpen(true)}
      />

    </div>
  );
}
