from fpdf import FPDF
import os
from datetime import datetime

width, height = 595, 842

topic_size = 32
subtopic_size = 24
normal_size = 16
padding = 10

next_topic = "next topic"
next_subtopic = "next subtopic"
image_trigger = "insert screenshot"


def getImportantWord(line):
    words = line.split(" ")
    ind = words.index("is")
    return " ".join(words[ind + 1:])


def isImportant(line, trigger):
    return line.lower().find(trigger) != -1


def generate(transcripts, classID):
    pdf = FPDF()

    inp = []
    if transcripts:
        inp = transcripts

    pdf.add_page()
    # image_count = 1
    now = datetime.now()
    class_datestamp = f'Class Notes\n{classID} {now.strftime("%d/%m/%Y")}'
    pdf.set_font("Helvetica", size=normal_size)
    pdf.set_text_color(255)
    pdf.set_fill_color(r=13, g=40, b=76)
    pdf.multi_cell(w=0, txt=class_datestamp, align="C",
                   h=normal_size / 2, fill=True)
    pdf.set_text_color(0)
    pdf.ln(h=padding)

    pdf.set_draw_color(r=13, g=40, b=76)

    for line in inp:
        line = line.strip()
        if isImportant(line, next_topic):
            pdf.ln(h=padding)
            pdf.set_text_color(255)
            pdf.set_font("Helvetica", style="B", size=topic_size)
            pdf.set_fill_color(r=13, g=40, b=76)
            pdf.multi_cell(
                txt=getImportantWord(line),
                w=pdf.get_string_width(getImportantWord(line) + " "),
                align="L",
                fill=True,
                h=topic_size / 2,
            )
            pdf.set_text_color(0)
            pdf.ln(h=padding)
        elif isImportant(line, next_subtopic):
            pdf.ln(h=padding)
            pdf.set_text_color(r=13, g=40, b=76)
            pdf.set_font("Helvetica", style="B", size=subtopic_size)
            pdf.multi_cell(
                txt=getImportantWord(line),
                w=pdf.get_string_width(getImportantWord(line)) + 10,
                align="L",
                h=subtopic_size / 2,
            )
            pdf.set_text_color(0)
            pdf.ln(h=padding)
        elif isImportant(line, image_trigger):
            pdf.set_font('Helvetica', size=topic_size)
            pdf.set_fill_color(167, 197, 238)
            pdf.set_text_color(r=13, g=40, b=76)
            pdf.multi_cell(txt="\nScreenshot here.\n\n", w=0,
                           h=topic_size/2, align="C", fill=True, border=1)
            pdf.cell(txt='', ln=1, w=0)
            pdf.set_text_color(0)
            pdf.ln(h=padding)
            # image_path = os.path.join(
            #     "data", classID.lower(), f"image_{image_count}.png"
            # )
            # if os.path.exists(image_path):
            #     pdf.ln(h=padding)
            #     pdf.image(image_path, w=190)
            #     pdf.ln(h=padding)
            #     image_count += 1
        else:
            pdf.set_font("Helvetica", size=normal_size)
            pdf.multi_cell(txt=line, w=0, h=normal_size / 2)
            pdf.cell(txt="", ln=1, w=0)

    return pdf.output(dest="S").encode("latin-1")

# def download_image():
