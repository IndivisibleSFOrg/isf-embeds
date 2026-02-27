.PHONY: FORCE all
.DELETE_ON_ERROR:
.SUFFIXES:

all: design-library.pdf

# Compile Tailwind source → standalone CSS for the design library
main.css: ../assets/css/main.css ../tailwind.config.js
	cd .. && ./node_modules/.bin/tailwindcss -i assets/css/main.css -o docs/main.css

# Explicit rule for design-library (depends on compiled CSS)
design-library.pdf: design-library.html main.css
	google-chrome \
		--headless \
		--disable-gpu \
		--run-all-compositor-stages-before-draw \
		--no-pdf-header-footer \
		--no-margins \
		--print-to-pdf="$@" design-library.html

# Generic rule for any other HTML→PDF conversions
%.pdf: %.html
	google-chrome \
		--headless \
		--disable-gpu \
		--run-all-compositor-stages-before-draw \
		--no-pdf-header-footer \
		--no-margins \
		--print-to-pdf="$@" $<
