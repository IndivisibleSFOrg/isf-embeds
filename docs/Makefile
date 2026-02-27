.PHONY: FORCE
.DELETE_ON_ERROR:
.SUFFIXES:

colors.pdf: colors.html
	google-chrome \
		--headless \
		--disable-gpu \
		--run-all-compositor-stages-before-draw \
		--no-pdf-header-footer \
		--no-margins \
		--print-to-pdf="$@" $<
