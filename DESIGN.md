---
name: Set Room
description: A classroom SET table with race timing and class standings.
colors:
  primary: "#173d31"
  primary-hover: "#285b43"
  competition: "#deef95"
  background: "#f4f6f3"
  paper: "#ffffff"
  board: "#e7ece5"
  quiet: "#52665c"
  rule: "#d6dfd8"
  field-border: "#c4d0c7"
  selected: "#f6fbe7"
  current-class: "#e8f1d3"
  error: "#a32937"
  symbol-red: "#bd3b44"
  symbol-green: "#23754f"
  symbol-purple: "#7546aa"
typography:
  timer:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "70px"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-.035em"
  headline:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "29px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-.035em"
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: ".055em"
rounded:
  control: "6px"
  card: "8px"
  board: "13px"
  dialog: "10px"
  progress: "4px"
  selection: "5px"
spacing:
  tight: "4px"
  compact: "8px"
  regular: "12px"
  board-inset: "18px"
  section: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "11px 19px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    textColor: "{colors.primary}"
    rounded: "{rounded.control}"
    padding: "9px 13px"
    height: "42px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.primary}"
    rounded: "{rounded.control}"
    padding: "11px 12px"
  mode-tabs:
    backgroundColor: "{colors.board}"
    textColor: "{colors.primary}"
    padding: "4px"
    height: "42px"
  playing-card:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.card}"
    padding: "22px 12px"
  selection-cell:
    textColor: "{colors.quiet}"
    rounded: "{rounded.selection}"
    size: "29px"
  progress-cell:
    textColor: "{colors.quiet}"
    rounded: "{rounded.progress}"
    size: "27px"
  pizza-leader:
    backgroundColor: "{colors.competition}"
    textColor: "{colors.primary}"
    rounded: "{rounded.card}"
    padding: "21px 20px 20px"
---

# Design System: Set Room

## Overview

**Creative North Star: "The School Games Club / Race Timing Sheet"**

A light, practical playing table gives the twelve SET cards the most space. Evergreen type, precise elapsed time, and compact numbered markers make the game legible on a classroom projector. The adjacent standings read like a results sheet, with a lime pizza leader and restrained medal hierarchy.

**Key Characteristics:**
- Quiet green neutrals and crisp white cards.
- Large tabular time beside visible set progress.
- Compact controls, thin rules, and generous board space.
- Competition emphasis carried by lime and rank, rather than decorative effects.

## Colors

Primary evergreen carries text, active controls, selected borders, and completed progress cells. Competition lime marks accepted sets and the pizza leader. Neutral background, board, paper, quiet text, and rules separate the playing surface from its controls. The current-class tint is softer than the leader panel.

SET symbols use their own red, green, and purple palette; shape, count, and fill remain equally visible. Selected cards receive the pale selected wash; hinted cards use an olive border and pale lime wash. Errors use the error color with explanatory text.

**The Competition Accent Rule.** Reserve the strongest lime area for the leader and successful set feedback; ordinary controls stay evergreen or neutral.

## Typography

DM Sans is the single family. Headings use compact spacing and medium weight; ordinary copy stays small and clear. The lowercase wordmark pairs a heavy “set” with a regular “room.” Timer, ranks, and result times use tabular numerals. The timer decimal is smaller and quieter than the whole seconds.

**The Measured Time Rule.** Preserve tabular numerals and the timer's hierarchy when adding results or elapsed-time states.

## Layout

The main container caps at 1460px with 4.8% side padding. Desktop uses a flexible playing column, a 320px standings column, and a 44px gap; a thin vertical rule separates them. The board is four columns by three rows. Its toolbar, timer, three-slot selection strip, feedback, and action row form a clear vertical sequence.

At 1100px the standings narrow to 270px and the gap to 26px. At 800px the standings move below play, separated by a horizontal rule. At 500px controls occupy full-width rows and the twelve cards become three columns by four rows. The mobile timer is 58px; the found-set receipts stack and keyboard help disappears. Projector mode reduces surrounding chrome and increases the card width ratio.

**The Board First Rule.** Keep the board and timer before standings in both visual and document order.

## Elevation & Depth

Depth comes mainly from tonal surfaces and thin borders. Playing cards carry a faint shadow; the start panel and dialogs use soft shadows to distinguish overlays. This corrects the former “no shadows” note: the finished interface is restrained, but not entirely flat. Exact shadow and motion values live in the sidecar.

## Shapes

Controls and fields use gently rounded corners. Cards are slightly softer; the board has the broadest radius. Small progress squares, numbered selection slots, circular status dots, and the three-stripe wordmark provide the recurring geometry. Borders remain thin except for the two-pixel card state outline.

## Components

- **Buttons and fields:** evergreen primary actions; transparent outlined secondary actions; quiet text actions. Fields sit on paper with a subdued border. Focus is a three-pixel symbol-green outline with a four-pixel offset. Disabled actions reduce opacity.
- **Mode and standings tabs:** modes use a compact segmented surface with an evergreen active segment. Today / All time use text and a thin active underline.
- **Playing cards:** white, numbered, with keyboard labels at the opposite corner. Hover lifts two pixels. Selection adds an evergreen outline, pale wash, and check; a valid set briefly fills lime while cards stay in Original or its three positions refill in Refill/Sprint. Hints use a separate olive outline.
- **Selection and progress:** three numbered slots confirm the cards being checked. Six numbered progress cells become evergreen with lime numerals as sets are found; found sets also appear as miniature-card receipts.
- **Standings:** the lime pizza panel leads with the class name, measured time, and date. Medal ranks establish the first three places; the current class has a pale tint and explicit label. Unplayed classes remain text rows. Empty standings use a small podium illustration and honest empty copy.
- **Completion and feedback:** the finish panel presents the final time and save state. Inline feedback explains invalid attributes; refresh remains a secondary action while elapsed time and progress continue. The footer visibly credits Rishik Rontala.

Card transitions run for 150–200ms; accepted sets use a brief 500ms pulse. Reduced motion disables animation and transitions. Keyboard selection uses 1–9 / Q / W / E, with Escape clearing the selection.

The [Duolingo league screen on Mobbin](https://mobbin.com/screens/f99db491-76b2-48f1-a2a8-b94f074a97f2) supplied the rank hierarchy and current-class emphasis. The finished interpretation keeps Set Room's quiet classroom table and timing-sheet typography.

## Do's and Don'ts

### Do:
- Do keep the board and measured timer dominant.
- Do use tabular numerals for every race result.
- Do pair card color with shape, fill, count, and optional color names.
- Do keep the current class identifiable in both color and text.
- Do preserve visible focus, reduced motion, and the builder credit.

### Don't:
- Don't add ornamental gradients or heavy shadows.
- Don't turn every section into a raised card.
- Don't use lime for routine controls or unrelated decoration.
- Don't let long class names push measured times out of their rows.

## Saved rooms and round history
The header provides a Saved rooms drawer-style dialog, while the current league has an explicit Save room control. Saved state uses the existing pale lime and check mark. A full-width round history follows the board and standings, with a quiet ruled table on desktop and two-column records on mobile so class, date, and time remain visible together. The archive reuses the same tabular numerals, evergreen text, secondary actions, and flat surfaces. Pagination reaches every round; export and reload stay at the history heading.

## Account access

The `/signin` page uses the same evergreen type, paper surface, quiet rules, and visible field focus as the classroom table. Sign in and Create account share a compact form with explicit labels, inline errors, and clear progress states. Saved rooms shows the signed-in account and a Sign out action. Account access supports email and password; copy must not imply email verification or password recovery.

## Original classroom mode
Original is the default game version, alongside Refill and Sprint in the existing compact menu. A quiet two-line guide explains the fixed board and class switching. Found sets stay in the receipt list; individual cards remain usable because different sets can share cards. Class selection remains available during a round, with a confirmation before ending it. Standings, history, and export label game versions separately.

Original’s Refresh board button sits in the toolbar above the cards. Confirmation explicitly says the current round ends and the timer restarts. A puzzle number in the guide, standings, and history keeps the shared competition understandable; cards still stay in place after each valid set.
