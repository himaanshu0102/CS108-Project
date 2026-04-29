# Snake Stack

A browser-based Snake game with a three-layer architecture: JavaScript frontend, Python (Flask) backend, and Bash administration script.

## How to Run

### Prerequisites
- Python 3.10.12
- pip
- A modern web browser
- Bash (for the admin script)
- zip (for log rotation)
- bc (for arithmetic in bash)

### Setting Up the Server

1. Clone the repository:
```bash
git clone https://github.com/himaanshu0102/CS108-Project.git
cd CS108-Project/snake-system
```

2. Create and activate a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:

pip install -r requirements.txt


4. Start the Flask server:

python3 app.py


5. Open your browser and navigate to:

http://127.0.0.1:5000


### Running the Admin Script

The admin script works independently of the Flask server. It reads `history.txt` directly.


bash admin.sh


The script presents a menu-driven interface with the following options:
1. **Select User Name** — Filter all queries to a specific user. Opens a sub-menu with user-specific analytics, recent scores, deletion, and sorting.
2. **View Analytics** — View top 5 users, average score, average time survived, fraction of wall/self deaths.
3. **View Recent Scores** — Paginated view of recent game scores (5 per page).
4. **Delete User Data** — Delete records by username, timestamp (exact/before/after), or invalid format entries. Asks for confirmation before deletion.
5. **Log Rotation** — Backs up `history.txt` as a compressed zip file and keeps only the last 10 entries.
6. **Sort Data** — View data sorted by score, timestamp, or username.
7. **Exit** — Exit the admin script.

## history.txt Format

Each game result is stored as a single line in `history.txt` with the following format:


[YYYY-MM-DD HH:MM:SS] Username | Score | Cause | Duration


### Fields

| Field | Description | Example |
|-------|-------------|---------|
| Timestamp | Date and time when the game ended, enclosed in square brackets | `[2025-06-12 14:35:02]` |
| Username | Player's first name (no spaces allowed) | `Sajal` |
| Score | Final score (length of snake) | `42` |
| Cause | How the snake died: `WALL` or `SELF` | `WALL` |
| Duration | Time survived in seconds | `85` |

### Example Entries


[2025-06-12 14:35:02] Himaanshu | 42 | WALL | 85
[2025-06-12 14:40:15] Sajal | 10 | SELF | 30
[2025-06-12 15:00:00] Himaanshu | 25 | WALL | 60


### Delimiter

Fields are separated by ` | ` (space-pipe-space). The timestamp is enclosed in square brackets `[]` and separated from the username by a space.

### Edge Cases

- If `history.txt` does not exist, the admin script displays "No history file found".
- If `history.txt` is empty, the admin script displays "History file is empty".
- The Flask server creates `history.txt` automatically if it does not exist (via Python's append mode).
- Usernames are validated to be non-empty before saving.
- Cause is validated to be either `WALL` or `SELF`.
- Score and duration are validated to be present and non-null.

### Format Validation Regex

The admin script uses the following regex to validate entries:

[YYYY-MM-DD HH:MM:SS] Username | Score | WALL/SELF | Duration


Regex pattern:

\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\] [a-zA-Z]+ \| [0-9]+ \| (WALL|SELF) \| [0-9]+


## Game Features

### Food Types
- **Green Apple** — Health +1 (score increases by 1, snake grows by 1)
- **Golden Apple** — Health +3 (score increases by 3, snake grows by 3)
- **Cookie** — Barrier immunity for 10 seconds (snake can pass through walls)
- **Lightning** — Time slow for 10 seconds (game speed is halved)

### Gameplay
- Snake controlled by Arrow Keys or WASD
- Grid-based movement on HTML5 Canvas (15x20 grid)
- Health system with 3 lives for wall collisions
- Wall collision reduces health by 1; at 0 health, the snake dies
- Self collision (snake eating itself) causes instant death
- Difficulty slider with 4 levels: Easy, Medium, Hard, Insane
- Score, time, and cookie immunity timer displayed during gameplay

### Game Over Screen
- Displays cause of death (WALL COLLISION or SELF DEATH)
- Random death message for each cause
- Shows final score, time survived, and session best score
- Displays timestamp of the game
- Play Again button to restart without refreshing

## Technical Implementation

### Game Engine

The game runs on the browser using HTML5 Canvas and JavaScript. The core data structure is an array called `snake`, where each element is an instance of a `Point` class. The `Point` class stores an x and y position (vector2 form) along with a `type` variable used for determining which sprite image to render (head, body, curve, or tail).

The `snake` array has a length equal to the current score plus the initial length. An input system using keyboard event listeners captures WASD and Arrow Key inputs to navigate the snake across the grid. When the snake collects a powerup, the array length and score increase accordingly, or a special benefit (immunity/time slow) is activated.

### Art and Sprites

All sprites for the snake (head, body, curve, tail), powerups (green apple, golden apple, cookie, lightning), and game elements (background tiles, borders, hearts) were created using LibreSprite. The art style uses pixelated 32x32 sprites to match the grid-based gameplay.

### Snake Rendering

The direction and turning of the snake at any point is determined by checking the previous point's position and the next point's position relative to the current point. If both neighbors are aligned on the same axis, a straight body sprite is used. If they differ on both axes, a curve sprite is rendered with the appropriate rotation.

### Death Conditions

The snake dies when:
- **Self collision**: The snake head occupies the same grid position as any other element in the snake array — causes instant death.
- **Wall collision**: The snake hits a vertical wall boundary. The player has 3 health points (lives). Each wall collision reduces health by 1. At 0 health, the snake dies.

When the snake dies, the score data is sent to the Flask server via the `fetch` API, and the Bash admin script can be used to inspect and manage the stored scores.

## Project Structure


snake-system/
├── app.py                  # Flask backend server
├── admin.sh                # Bash administration script
├── history.txt             # Game score storage (auto-created)
├── requirements.txt        # Python dependencies
├── README.md               # This file
├── report/
│   ├── report.tex          # LaTeX report source
│   ├── Makefile            # Compiles the LaTeX report (run 'make')
│   └── report.pdf          # Generated report (after running make)
└── static/
    ├── index.html          # Main game page
    ├── style.css           # Stylesheet
    ├── engine.js           # Game logic
    ├── bootstrap.min.css   # Bootstrap CSS (bundled for offline use)
    ├── bootstrap.bundle.min.js  # Bootstrap JS (bundled for offline use)
    ├── Apple.png           # Green apple sprite
    ├── goldenApple.png     # Golden apple sprite
    ├── cookie.png          # Cookie sprite
    ├── lightning.png       # Lightning sprite
    ├── snakehead.png       # Snake head sprite
    ├── snakebod.png        # Snake body sprite
    ├── snakeCurve.png      # Snake curve sprite
    ├── snaketail.png       # Snake tail sprite
    ├── heart.png           # Health indicator sprite
    ├── backtile2.png       # Game background tile
    └── borders.png         # Game border overlay


### Compiling the Report


cd report
make


This runs `pdflatex` to generate `report.pdf` from `report.tex`.

## Three-Layer Communication


Browser (JavaScript) → POST /save_score → Flask (Python) → history.txt ← Bash script


1. **JavaScript → Flask**: When the snake dies, `engine.js` sends a POST request with JSON data (`name`, `score`, `cause`, `duration`) to the `/save_score` endpoint using the `fetch` API.

2. **Flask → history.txt**: The Flask server validates the incoming data, generates a timestamp, formats the entry, and appends it to `history.txt`.

3. **Bash ← history.txt**: The `admin.sh` script reads `history.txt` directly using text-processing tools (`awk`, `cut`, `sort`, `sed`, `grep`, `head`, `tail`) to display analytics, manage records, and perform log rotation.

Each layer is strictly independent — JavaScript contains no file I/O logic, Flask contains no game logic, and Bash does not depend on Flask being running.

## Authors

- Sajal Sahu
- Himaanshu