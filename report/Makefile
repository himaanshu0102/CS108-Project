all: report.pdf

report.pdf: report.tex references.bib
	pdflatex -interaction=nonstopmode report.tex
	bibtex report
	pdflatex -interaction=nonstopmode report.tex
	pdflatex -interaction=nonstopmode report.tex

clean:
	rm -f *.aux *.log *.toc *.out *.bbl *.blg

.PHONY: all clean
