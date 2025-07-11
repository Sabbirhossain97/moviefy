#!/bin/bash

# Set script to fail on error
set -e

# Paths
PUPPETEER_DIR="./puppeteer"
SCREENSHOTS_DIR="$PUPPETEER_DIR/screenshots"
PDF_PATH="$PUPPETEER_DIR/screenshot-report.pdf"
REPORT_DIR="./gemini_reports"
REPORT_FILE="$REPORT_DIR/ui_ux_report.md"
BOOK_PATH="./Refactoring UI.pdf"

# Step 1: Run Puppeteer script
echo "▶ Running Puppeteer screenshot script..."
node "$PUPPETEER_DIR/login_and_screenshot.js"

# Step 2: Check if screenshots exist
if [ ! -d "$SCREENSHOTS_DIR" ] || [ -z "$(ls -A $SCREENSHOTS_DIR)" ]; then
  echo "❌ No screenshots found. Exiting."
  exit 1
fi

# Step 3: Ensure report directory exists
mkdir -p "$REPORT_DIR"

# Step 4: Build Gemini CLI prompt dynamically
echo "▶ Running Gemini CLI with UI/UX prompt..."

gemini -m "gemini-2.5-pro" <<EOF > "$REPORT_FILE"
You are an expert UI/UX reviewer familiar with the design principles from the book "Refactoring UI".

Please perform a UI/UX analysis based on screenshots stored in the folder:
\`$SCREENSHOTS_DIR\`

Use the design principles from the book:
\`$BOOK_PATH\`

For each screenshot:
- Identify UI patterns that follow Refactoring UI principles.
- Identify critical UI/UX issues violating good design practices.
- Suggest specific improvements for each issue.
- Use Markdown formatting with sections: "Good Practices", "Issues", and "Recommendations".

Generate a complete UI/UX report and save it in ai_training folder.
EOF