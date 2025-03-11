document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const chapterGrid = document.getElementById('chapter-grid');
    const themeToggle = document.getElementById('theme-toggle');

    // Theme toggle functionality
    themeToggle.addEventListener('change', function () {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        themeToggle.checked = false;
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    }

    // Fetch chapters
    async function fetchChapters() {
        try {
            console.log('Fetching chapters from API endpoint');
            const response = await fetch('/api/chapters');

            if (response.ok) {
                const chapters = await response.json();
                console.log(`Loaded ${chapters.length} chapters from API`);

                // Get metadata for each chapter and render cards
                Promise.all(chapters.map(async (chapter) => {
                    try {
                        const metadata = await fetchChapterMetadata(chapter.metadataPath);
                        return {
                            ...chapter,
                            translator: metadata.translator || 'Unknown',
                            published: metadata.published || 'Unknown date'
                        };
                    } catch (error) {
                        console.error(`Error fetching metadata for chapter ${chapter.number}:`, error);
                        return {
                            ...chapter,
                            translator: 'Unknown',
                            published: 'Unknown date'
                        };
                    }
                })).then(chaptersWithMetadata => {
                    renderChapterGrid(chaptersWithMetadata);
                });
            } else {
                throw new Error(`Failed to fetch chapters: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching chapters:', error);
            chapterGrid.innerHTML = '<div class="error">Failed to load chapters. Please try again.</div>';

            // Fallback to static chapter list
            console.log('Falling back to static chapter list');
            simulateFetchChapters();
        }
    }

    // Function to simulate fetching chapters by scanning the data directory
    function simulateFetchChapters() {
        console.log('Using static chapter list fallback');

        // Get chapter numbers from the directory structure (hardcoded for fallback)
        const chapterDirectories = [
            191, 192, 193, 194, 195, 196, 197, 198, 199, 200,
            201, 202, 203, 204, 205, 206, 207, 208, 209, 210,
            211, 212, 213, 214, 215, 216, 217, 218, 219, 220,
            221, 222, 223, 224, 225, 226, 227, 228, 229, 230,
            231, 232, 233, 234, 235, 236, 237, 238, 239, 240,
            241, 242, 243, 244, 245, 246, 247, 248, 249, 250,
            251, 252, 253, 254, 255, 256, 257, 258, 259, 260,
            261, 262, 263, 264, 265, 266, 267, 268, 269, 270,
            271, 272, 273, 274, 275, 276, 277, 278, 279, 280,
            281, 282, 283, 284, 285, 286, 287, 288, 289
        ];

        const chapters = chapterDirectories.map(num => ({
            number: num,
            path: `data/chapter-${num}/chapter-${num}.txt`,
            metadataPath: `data/chapter-${num}/README.md`
        }));

        // Get metadata for each chapter and render cards
        Promise.all(chapters.map(async (chapter) => {
            try {
                const metadata = await fetchChapterMetadata(chapter.metadataPath);
                return {
                    ...chapter,
                    translator: metadata.translator || 'Unknown',
                    published: metadata.published || 'Unknown date'
                };
            } catch (error) {
                console.error(`Error fetching metadata for chapter ${chapter.number}:`, error);
                return {
                    ...chapter,
                    translator: 'Unknown',
                    published: 'Unknown date'
                };
            }
        })).then(chaptersWithMetadata => {
            renderChapterGrid(chaptersWithMetadata);
        });
    }

    // Fetch chapter metadata from README.md
    async function fetchChapterMetadata(path) {
        try {
            console.log('Fetching metadata from:', path);
            const response = await fetch(path);

            if (response.ok) {
                const text = await response.text();

                // Parse the YAML-like format from README.md
                const metadata = {
                    chapter: '',
                    translator: '',
                    published: '',
                    source: ''
                };

                const lines = text.split('\n');
                lines.forEach(line => {
                    if (line.startsWith('- translator:')) {
                        metadata.translator = line.replace('- translator:', '').trim();
                    } else if (line.startsWith('- published:')) {
                        const dateStr = line.replace('- published:', '').trim();
                        metadata.published = formatDate(dateStr);
                    }
                });

                return metadata;
            } else {
                console.log('Metadata fetch failed, status:', response.status);
                throw new Error('Failed to fetch chapter metadata');
            }

        } catch (error) {
            console.error('Error fetching chapter metadata:', error);

            // For development/demo purposes, try XMLHttpRequest as fallback
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', path, true);
                xhr.overrideMimeType('text/plain');

                xhr.onload = function () {
                    if (xhr.status === 200) {
                        console.log('Metadata XMLHttpRequest successful for', path);
                        const text = xhr.responseText;
                        const metadata = {
                            translator: '',
                            published: ''
                        };

                        const lines = text.split('\n');
                        lines.forEach(line => {
                            if (line.startsWith('- translator:')) {
                                metadata.translator = line.replace('- translator:', '').trim();
                            } else if (line.startsWith('- published:')) {
                                const dateStr = line.replace('- published:', '').trim();
                                metadata.published = formatDate(dateStr);
                            }
                        });

                        resolve(metadata);
                    } else {
                        console.log('Metadata XMLHttpRequest failed, using defaults');
                        // Return default metadata if unable to load
                        resolve({
                            translator: 'Unknown',
                            published: 'Unknown date'
                        });
                    }
                };

                xhr.onerror = function () {
                    console.log('Metadata XMLHttpRequest error');
                    // Return default metadata on error
                    resolve({
                        translator: 'Unknown',
                        published: 'Unknown date'
                    });
                };

                xhr.send();
            });
        }
    }

    // Format ISO date to readable format
    function formatDate(isoDate) {
        try {
            const date = new Date(isoDate);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return isoDate; // Return original if parsing fails
        }
    }

    // Render the chapter grid
    function renderChapterGrid(chapters) {
        chapterGrid.innerHTML = '';

        if (chapters.length === 0) {
            chapterGrid.innerHTML = '<div class="error">No chapters found. Please check the data directory structure.</div>';
            return;
        }

        // Sort chapters by number (ascending)
        const sortedChapters = [...chapters].sort((a, b) => a.number - b.number);

        sortedChapters.forEach(chapter => {
            const chapterCard = document.createElement('a');
            chapterCard.href = `chapter.html?id=${chapter.number}`;
            chapterCard.className = 'chapter-card';

            chapterCard.innerHTML = `
                <h3>Chapter ${chapter.number}</h3>
                <div class="chapter-info">
                    <div class="translator">Translator: ${chapter.translator}</div>
                    <div class="published">Published: ${chapter.published}</div>
                </div>
            `;

            chapterGrid.appendChild(chapterCard);
        });
    }

    // Initialize
    fetchChapters();
}); 