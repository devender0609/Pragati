# Page-level decomposition — how the reading was done

`tools/digest.py <chapter.pdf> [chars]` prints one line per page: the PDF
page index, the printed folio, the bold headings on that page, and the
first run of body text. That is enough to judge what a page teaches
without pulling a whole book into a conversation, and it makes the
reading reproducible: anyone can run it against the same PDF and see the
same pages.

Books are the current NCERT PDFs recorded in
`src/curriculum/data/mathCurriculumMasterEvidence.json`, with checksums
in `curriculum-verification/master-map/`.

Every unit in `src/curriculum/data/instructionalDecomposition.json`
carries both the printed page range and the PDF page range, because the
Class 6 page defect came from recording only one of them.
