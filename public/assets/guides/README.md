# Guide PDFs

Drop the actual lead-magnet PDFs in this folder, named:

- `jsong-atlanta-buyers-guide.pdf` — sent from `/buyers/` lead-magnet form
- `jsong-atlanta-sellers-guide.pdf` — sent from `/sellers/` lead-magnet form

The download path is keyed off `JSONG_CONFIG.guides.buyer.pdfPath` in `assets/js/api-config.js` — change there if you rename the file.

If you want to gate downloads behind the email submission (i.e., not let people skip the form by guessing the URL), move the PDFs to a private bucket and have the lead-magnet form's email service deliver a signed link. For a static site like this one, the file is technically discoverable — that's fine for free guides; revisit if you ever paywall something.
