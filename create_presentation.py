import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color palette
    BG_COLOR = RGBColor(250, 248, 245)      # Warm cream #FAF8F5
    CARD_BG = RGBColor(255, 255, 255)       # Pure White
    DARK_TEXT = RGBColor(15, 23, 42)        # Slate 900
    MUTED_TEXT = RGBColor(100, 116, 139)    # Slate 500
    EMERALD = RGBColor(5, 150, 105)         # Green #059669
    AMBER = RGBColor(217, 119, 6)           # Amber #D97706
    ROSE = RGBColor(225, 29, 72)            # Rose #E11D48
    BLUE = RGBColor(37, 99, 235)            # Blue #2563EB
    BORDER_COLOR = RGBColor(226, 232, 240)  # Border

    def add_bg_and_header(slide, title_text, category_tag):
        # Background
        bg_shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg_shape.fill.solid()
        bg_shape.fill.fore_color.rgb = BG_COLOR
        bg_shape.line.fill.background()

        # Header banner
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.733), Inches(1.1))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p0 = tf.paragraphs[0]
        p0.text = f"ITC INFOTECH · EMINENCE CAMPUS DRIVE | {category_tag}"
        p0.font.size = Pt(11)
        p0.font.bold = True
        p0.font.color.rgb = AMBER

        p1 = tf.add_paragraph()
        p1.text = title_text
        p1.font.size = Pt(24)
        p1.font.bold = True
        p1.font.color.rgb = DARK_TEXT

    # ==========================================================
    # SLIDE 1: Title & Problem Architecture
    # ==========================================================
    slide1 = prs.slides.add_slide(blank_layout)
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = BG_COLOR
    bg1.line.fill.background()

    # Title Box
    title_box = slide1.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(11.733), Inches(2.2))
    tf1 = title_box.text_frame
    tf1.word_wrap = True
    
    p = tf1.paragraphs[0]
    p.text = "CommentGuard AI"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = DARK_TEXT

    p_sub = tf1.add_paragraph()
    p_sub.text = "Cascaded AI Moderation Architecture for Cooking Video Platforms"
    p_sub.font.size = Pt(20)
    p_sub.font.bold = True
    p_sub.font.color.rgb = EMERALD

    p_cand = tf1.add_paragraph()
    p_cand.text = "Candidate: Bheemsetty Dhanush | Position: Eminence Campus Drive 2026"
    p_cand.font.size = Pt(13)
    p_cand.font.color.rgb = MUTED_TEXT

    # 3 Stat / Problem Constraints Cards
    cards_data = [
        ("The Challenge", "20,000 comments/day across cooking videos.\nSpam links, abusive comments, and unauthorized promotions degrade creator engagement."),
        ("The Human Bottleneck", "Only 2 human moderators available.\nRealistically, 2 people can only review ~1,000 to 1,500 items daily. Manual review is impossible."),
        ("The Solution Strategy", "Cascaded 3-tier system: AI Rules -> Classical ML -> Small Transformer.\nAI auto-processes 94%; only ~320 borderline cases reach the 2 moderators.")
    ]

    for i, (ctitle, cdesc) in enumerate(cards_data):
        left = Inches(0.8 + i * 3.95)
        top = Inches(3.2)
        width = Inches(3.75)
        height = Inches(3.5)

        card = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_COLOR
        card.line.width = Pt(1.5)

        tb = slide1.shapes.add_textbox(left + Inches(0.3), top + Inches(0.3), width - Inches(0.6), height - Inches(0.6))
        c_tf = tb.text_frame
        c_tf.word_wrap = True
        
        cp1 = c_tf.paragraphs[0]
        cp1.text = ctitle
        cp1.font.size = Pt(16)
        cp1.font.bold = True
        cp1.font.color.rgb = DARK_TEXT

        cp2 = c_tf.add_paragraph()
        cp2.text = cdesc
        cp2.font.size = Pt(12)
        cp2.font.color.rgb = MUTED_TEXT
        cp2.space_before = Pt(10)

    # ==========================================================
    # SLIDE 2: The 3-Tier AI Cascade Architecture
    # ==========================================================
    slide2 = prs.slides.add_slide(blank_layout)
    add_bg_and_header(slide2, "The 3-Tier Cascade Architecture: AI ⊃ ML ⊃ DL", "SYSTEM ARCHITECTURE")

    layers = [
        ("Layer 1: Deterministic AI Rules", "Obvious Filters (~1ms latency)", 
         "• Regex for shorteners (bit.ly, t.me), telegram handles, and phone numbers.\n• Known spam domain blacklists and severe hate speech blocklists.\n• Cooking domain allowlist protects culinary verbs ('beat', 'kill the heat').\n• Catches 50-60% of obvious traffic at zero compute cost.",
         DARK_TEXT),
        ("Layer 2: Classical Machine Learning", "Probabilistic Scoring (~4ms latency)", 
         "• Feature extraction: TF-IDF, character n-grams, caps ratio, link counts.\n• Lightweight classifier: Logistic Regression / Naive Bayes.\n• Computes prior probabilities: P(fine), P(spam), P(abusive).\n• Fast workhorse handling bulk classification with full explainability.",
         AMBER),
        ("Layer 3: Small Transformer (DistilBERT)", "Context & Nuance (~14ms CPU)", 
         "• Fine-tuned 66M parameter DistilBERT model (NOT a bulky LLM).\n• Understands sentence structure, sentiment, and cooking slang.\n• Resolves ambiguous cases: 'killer recipe' (praise) vs. hostile threats.\n• Evaluates ONLY the remaining borderline cases (~15-20% of traffic).",
         EMERALD),
        ("Layer 4: Human-in-the-Loop Safeguard", "2 Moderators (~320 cases/day)", 
         "• Evaluates uncertain comments where confidence is 40% - 89%.\n• Moderators review a manageable backlog of ~160 comments each.\n• Every human decision generates a fresh active learning label.\n• Drives weekly model retraining and threshold recalibration.",
         BLUE)
    ]

    for i, (ltitle, lsub, ldesc, lcolor) in enumerate(layers):
        left = Inches(0.8 + i * 2.95)
        top = Inches(1.8)
        width = Inches(2.8)
        height = Inches(4.9)

        card = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_COLOR
        card.line.width = Pt(1.5)

        tb = slide2.shapes.add_textbox(left + Inches(0.2), top + Inches(0.25), width - Inches(0.4), height - Inches(0.5))
        c_tf = tb.text_frame
        c_tf.word_wrap = True

        p1 = c_tf.paragraphs[0]
        p1.text = ltitle
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = lcolor

        p2 = c_tf.add_paragraph()
        p2.text = lsub
        p2.font.size = Pt(10)
        p2.font.bold = True
        p2.font.color.rgb = MUTED_TEXT

        p3 = c_tf.add_paragraph()
        p3.text = ldesc
        p3.font.size = Pt(10)
        p3.font.color.rgb = DARK_TEXT
        p3.space_before = Pt(10)

    # ==========================================================
    # SLIDE 3: Classification & Actions (Q1 & Q2)
    # ==========================================================
    slide3 = prs.slides.add_slide(blank_layout)
    add_bg_and_header(slide3, "Classification Strategy & Automated Action Policies", "QUESTION 1 & 2")

    categories = [
        ("FINE COMMENTS (57%)", "Confidence ≥ 90%",
         "Definition:\nConstructive queries, recipe feedback, compliments ('Can I use oat milk?', 'Great recipe!').\n\nAutomated Action:\nAUTO-PUBLISH immediately.\nVisible to all users instantly; zero creator friction.",
         EMERALD),
        ("SPAM COMMENTS (21%)", "Confidence ≥ 90% or URL regex",
         "Definition:\nExternal redirect links (bit.ly), follower bots ('DM for promo'), financial scams.\n\nAutomated Action:\nAUTO-HIDE & LOG.\nHidden from public view; repeat offending accounts receive shadowbans or captchas.",
         AMBER),
        ("ABUSIVE COMMENTS (5%)", "Confidence ≥ 90% or slur match",
         "Definition:\nDirect ad-hominem harassment, hate speech, vulgarity targeting creators or users.\n\nAutomated Action:\nAUTO-HIDE & POLICY FLAG.\nHidden instantly; triggers safety strikes and temporary commenting cooldowns.",
         ROSE),
        ("UNCLEAR / BORDERLINE (18%)", "Confidence 40% - 89%",
         "Definition:\nSarcasm ('Wow, genius idea...'), vague links, mixed sentiment, or novel phrases.\n\nAutomated Action:\nROUTE TO MODERATOR QUEUE.\nPrioritized by risk score. 2 moderators review the top ~320 borderline cases.",
         BLUE)
    ]

    for i, (ctitle, csub, cdesc, ccolor) in enumerate(categories):
        left = Inches(0.8 + i * 2.95)
        top = Inches(1.8)
        width = Inches(2.8)
        height = Inches(4.9)

        card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = ccolor
        card.line.width = Pt(2.0)

        tb = slide3.shapes.add_textbox(left + Inches(0.25), top + Inches(0.25), width - Inches(0.5), height - Inches(0.5))
        c_tf = tb.text_frame
        c_tf.word_wrap = True

        p1 = c_tf.paragraphs[0]
        p1.text = ctitle
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = ccolor

        p2 = c_tf.add_paragraph()
        p2.text = csub
        p2.font.size = Pt(10)
        p2.font.bold = True
        p2.font.color.rgb = MUTED_TEXT

        p3 = c_tf.add_paragraph()
        p3.text = cdesc
        p3.font.size = Pt(10.5)
        p3.font.color.rgb = DARK_TEXT
        p3.space_before = Pt(8)

    # ==========================================================
    # SLIDE 4: False Positives & Evolving Tricks (Q3 & Q4)
    # ==========================================================
    slide4 = prs.slides.add_slide(blank_layout)
    add_bg_and_header(slide4, "Avoiding False Positives & Continuous Learning", "QUESTION 3 & 4")

    # Left Column: Q3 Avoiding False Hides
    left_card = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.7), Inches(4.9))
    left_card.fill.solid()
    left_card.fill.fore_color.rgb = CARD_BG
    left_card.line.color.rgb = BORDER_COLOR
    left_card.line.width = Pt(1.5)

    tb_l = slide4.shapes.add_textbox(Inches(1.1), Inches(2.0), Inches(5.1), Inches(4.5))
    tf_l = tb_l.text_frame
    tf_l.word_wrap = True

    p = tf_l.paragraphs[0]
    p.text = "Q3: Avoiding Hiding Genuine Comments"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = DARK_TEXT

    points_q3 = [
        ("Cooking Context Aware Model", "Culinary terms like 'beat the eggs', 'kill the heat', or 'to die for' would trigger naive filters. DistilBERT evaluates sentence-level context to recognize culinary enthusiasm and technique."),
        ("Asymmetric High Confidence Bar", "We require ≥90% confidence to auto-hide. Borderline comments (75% spam) are routed to human review rather than being hidden by mistake. Preserving genuine audience engagement is priority #1."),
        ("Creator Appeal & Held Queue", "Creators have access to a 'Held for Review' panel to restore false hides with 1 click. Users can submit an appeal, which reweights mislabeled comments in the training set.")
    ]
    for p_title, p_desc in points_q3:
        p_t = tf_l.add_paragraph()
        p_t.text = f"• {p_title}: "
        p_t.font.bold = True
        p_t.font.size = Pt(11)
        p_t.font.color.rgb = EMERALD
        p_t.space_before = Pt(10)

        p_d = tf_l.add_paragraph()
        p_d.text = p_desc
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = DARK_TEXT

    # Right Column: Q4 Keeping up with New Tricks
    right_card = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.9))
    right_card.fill.solid()
    right_card.fill.fore_color.rgb = CARD_BG
    right_card.line.color.rgb = BORDER_COLOR
    right_card.line.width = Pt(1.5)

    tb_r = slide4.shapes.add_textbox(Inches(7.1), Inches(2.0), Inches(5.1), Inches(4.5))
    tf_r = tb_r.text_frame
    tf_r.word_wrap = True

    p = tf_r.paragraphs[0]
    p.text = "Q4: Keeping Up with New Spam Tricks"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = DARK_TEXT

    points_q4 = [
        ("Active Learning Feedback Loop", "Every moderator action (Approve/Hide/Escalate) becomes a labeled training example. The 2 moderators generate ~300 verified labels daily, continuously training the system on emerging tricks."),
        ("Adversarial Text Normalization", "Spammers use spaces ('c-h-e-a-p'), zero-width unicode characters, and homoglyphs. Layer 1 preprocessing normalizes unicode characters and unshortens redirect links before classification."),
        ("Weekly Retraining & Drift Monitoring", "Weekly automated fine-tuning of DistilBERT on new labels. Concept drift is monitored: if False Positive rate rises above 2.5%, thresholds and rules automatically re-calibrate.")
    ]
    for p_title, p_desc in points_q4:
        p_t = tf_r.add_paragraph()
        p_t.text = f"• {p_title}: "
        p_t.font.bold = True
        p_t.font.size = Pt(11)
        p_t.font.color.rgb = AMBER
        p_t.space_before = Pt(10)

        p_d = tf_r.add_paragraph()
        p_d.text = p_desc
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = DARK_TEXT

    output_path = r"C:\Users\dhanu\Downloads\Spam Detection\CommentGuard_AI_Presentation.pptx"
    prs.save(output_path)
    print(f"Presentation successfully saved to {output_path}")

if __name__ == '__main__':
    build_presentation()

