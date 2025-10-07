# CI Build Metrics

## Overview
This workflow runs on every PR to `main` and generates build metrics for performance tracking.

## Where to Find Metrics

### Job Summary
After the workflow completes, click on the workflow run and navigate to the **Summary** tab to see:
- Total `dist/` folder size
- Top 30 largest files with sizes in KB

### Artifacts
The complete `dist/` folder is uploaded as an artifact named `dist` for detailed inspection.

### Future Enhancement (Step 3)
When the bundle analyzer is configured in Step 3, this workflow will be updated to:
- Run `ANALYZE=1 npm run analyze`
- Attach `dist/stats.html` as an artifact for visual bundle analysis
