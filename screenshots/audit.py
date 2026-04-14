"""
Comprehensive Playwright visual audit of the Utdrikningslag dashboard.
Takes screenshots at multiple viewports, themes, and component states.
"""

import os
import time
from pathlib import Path
from playwright.sync_api import sync_playwright, Page

URL = "http://localhost:5173/utdrikningslag/"
OUT = Path(r"C:\Users\AD10209\01. WMIO - Kevin Ha\21. VSCode og Claude\apps\utdrikningslag\screenshots")
OUT.mkdir(parents=True, exist_ok=True)

VIEWPORTS = [
    ("desktop", 1440, 900),
    ("tablet", 768, 1024),
    ("mobile", 375, 812),
]


def wait_ready(page: Page):
    """Wait for page to be fully loaded and animations settled."""
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1500)  # let Framer Motion animations complete


def screenshot(page: Page, name: str, full_page: bool = True, clip: dict = None):
    """Take a screenshot and print the path."""
    path = str(OUT / f"{name}.png")
    kwargs = {"path": path, "full_page": full_page}
    if clip:
        kwargs["clip"] = clip
        kwargs["full_page"] = False
    page.screenshot(**kwargs)
    print(f"  -> {path}")
    return path


def get_element_box(page: Page, selector: str) -> dict:
    """Get bounding box for an element, with padding."""
    el = page.locator(selector).first
    el.wait_for(state="visible", timeout=5000)
    box = el.bounding_box()
    if box:
        # Add some padding
        pad = 16
        return {
            "x": max(0, box["x"] - pad),
            "y": max(0, box["y"] - pad),
            "width": box["width"] + pad * 2,
            "height": box["height"] + pad * 2,
        }
    return None


def capture_viewport(page: Page, vp_name: str, width: int, height: int):
    """Capture all screenshots for one viewport size."""
    page.set_viewport_size({"width": width, "height": height})
    page.goto(URL)
    wait_ready(page)

    prefix = f"{vp_name}_{width}x{height}"
    print(f"\n=== Viewport: {prefix} ===")

    # 1. Full page — dark mode (default)
    screenshot(page, f"{prefix}_full_dark")

    # 2. Header/stats area
    try:
        header_box = page.locator("header").first.bounding_box()
        # Try to capture header + stats area together
        stats_elements = page.locator("header ~ *").first
        stats_box = stats_elements.bounding_box() if stats_elements.count() > 0 else None

        if header_box:
            clip_height = header_box["height"] + 200  # header + stats area
            if stats_box:
                clip_height = (stats_box["y"] + stats_box["height"]) - header_box["y"] + 32
            screenshot(page, f"{prefix}_header_stats_dark", clip={
                "x": 0,
                "y": 0,
                "width": width,
                "height": min(clip_height + 32, height * 2),
            })
    except Exception as e:
        print(f"  [WARN] header screenshot failed: {e}")

    # 3. Click first timeline card to expand it
    try:
        first_card_button = page.locator("button").filter(has_text="M-").first
        first_card_button.scroll_into_view_if_needed()
        page.wait_for_timeout(300)
        first_card_button.click()
        page.wait_for_timeout(800)  # let expand animation finish

        # Screenshot the expanded card area
        card_container = first_card_button.locator("..").locator("..")  # parent card
        card_box = card_container.bounding_box()
        if card_box:
            screenshot(page, f"{prefix}_card_expanded_dark", clip={
                "x": max(0, card_box["x"] - 16),
                "y": max(0, card_box["y"] - 16),
                "width": min(card_box["width"] + 32, width),
                "height": card_box["height"] + 32,
            })
        else:
            # Fallback: screenshot top portion where cards are
            screenshot(page, f"{prefix}_card_expanded_dark", clip={
                "x": 0,
                "y": max(0, first_card_button.bounding_box()["y"] - 50),
                "width": width,
                "height": 600,
            })
    except Exception as e:
        print(f"  [WARN] card expand screenshot failed: {e}")

    # 4. Budget section
    try:
        # Find the budget section heading
        budget_heading = page.locator("text=Budsjettsporing").first
        budget_heading.scroll_into_view_if_needed()
        page.wait_for_timeout(500)

        budget_box = budget_heading.bounding_box()
        if budget_box:
            # Capture from budget heading down ~800px
            screenshot(page, f"{prefix}_budget_dark", clip={
                "x": 0,
                "y": max(0, budget_box["y"] - 24),
                "width": width,
                "height": 900,
            })
    except Exception as e:
        print(f"  [WARN] budget screenshot failed: {e}")

    # 5. Switch to LIGHT MODE
    try:
        theme_btn = page.locator("button[aria-label*='tema'], button[aria-label*='Bytt']").first
        theme_btn.click()
        page.wait_for_timeout(800)  # let theme transition complete

        # Full page light mode
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(300)
        screenshot(page, f"{prefix}_full_light")

        # Header in light mode
        try:
            screenshot(page, f"{prefix}_header_stats_light", clip={
                "x": 0,
                "y": 0,
                "width": width,
                "height": 500,
            })
        except Exception as e:
            print(f"  [WARN] light header screenshot failed: {e}")

        # Budget in light mode
        try:
            budget_heading2 = page.locator("text=Budsjettsporing").first
            budget_heading2.scroll_into_view_if_needed()
            page.wait_for_timeout(500)
            b_box = budget_heading2.bounding_box()
            if b_box:
                screenshot(page, f"{prefix}_budget_light", clip={
                    "x": 0,
                    "y": max(0, b_box["y"] - 24),
                    "width": width,
                    "height": 900,
                })
        except Exception as e:
            print(f"  [WARN] light budget screenshot failed: {e}")

        # Switch back to dark mode for next viewport
        theme_btn2 = page.locator("button[aria-label*='tema'], button[aria-label*='Bytt']").first
        theme_btn2.click()
        page.wait_for_timeout(500)

    except Exception as e:
        print(f"  [WARN] theme toggle failed: {e}")


def main():
    print(f"Screenshot output dir: {OUT}")
    taken = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            device_scale_factor=2,  # retina quality
            locale="nb-NO",
        )
        page = context.new_page()

        for vp_name, w, h in VIEWPORTS:
            try:
                capture_viewport(page, vp_name, w, h)
            except Exception as e:
                print(f"  [ERROR] Viewport {vp_name} failed: {e}")

        browser.close()

    # List all generated screenshots
    files = sorted(OUT.glob("*.png"))
    print(f"\n{'='*60}")
    print(f"Total screenshots: {len(files)}")
    for f in files:
        size_kb = f.stat().st_size / 1024
        print(f"  {f.name:50s} {size_kb:7.1f} KB")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
