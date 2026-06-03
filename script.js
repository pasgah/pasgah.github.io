class BlogApp {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.currentPage = 0;
        this.postsPerPage = 6;
        this.isLoading = false;
        this.hasMore = true;
        this.searchMode = false;
        this.observer = null;
        this.postsGrid = document.getElementById('postsGrid');
        this.sentinel = document.getElementById('sentinel');
        this.loader = document.getElementById('loader');
        this.noMore = document.getElementById('noMorePosts');
        this.searchInput = document.getElementById('searchInput');
        this.overlay = document.getElementById('postOverlay');
        this.postFullContent = document.getElementById('postFullContent');
        this.closeBtn = document.getElementById('closeOverlay');
        this.init();
    }

    async init() {
        await this.fetchPostsData();
        this.setupObserver();
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.closeBtn.addEventListener('click', () => this.closePost());
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.closePost(); });
        window.addEventListener('popstate', (e) => this.handlePopState(e));
        this.renderNextPage();
        this.checkDirectPostAccess();
    }

    async fetchPostsData() {
        try {
            const res = await fetch('/posts.json');
            if (!res.ok) throw new Error('خطا در دریافت داده');
            this.posts = await res.json();
            this.filteredPosts = [...this.posts];
        } catch (err) {
            console.error(err);
            this.posts = [];
            this.filteredPosts = [];
        }
    }

    setupObserver() {
        this.observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !this.isLoading && this.hasMore) {
                this.loadMore();
            }
        }, { rootMargin: '100px' });
        this.observer.observe(this.sentinel);
    }

    handleSearch(query) {
        const q = query.trim().toLowerCase();
        if (q === '') {
            this.searchMode = false;
            this.filteredPosts = [...this.posts];
        } else {
            this.searchMode = true;
            this.filteredPosts = this.posts.filter(post =>
                post.title.toLowerCase().includes(q) ||
                post.excerpt.toLowerCase().includes(q) ||
                (post.tags && post.tags.some(tag => tag.toLowerCase().includes(q)))
            );
        }
        this.resetAndRender();
    }

    resetAndRender() {
        this.currentPage = 0;
        this.hasMore = true;
        this.postsGrid.innerHTML = '';
        this.noMore.style.display = 'none';
        this.loader.style.display = 'none';
        this.renderNextPage();
    }

    renderNextPage() {
        const start = this.currentPage * this.postsPerPage;
        const end = start + this.postsPerPage;
        const pagePosts = this.filteredPosts.slice(start, end);
        if (pagePosts.length === 0) {
            this.hasMore = false;
            this.noMore.style.display = 'block';
            return;
        }
        const fragment = document.createDocumentFragment();
        pagePosts.forEach(post => {
            fragment.appendChild(this.createPostCard(post));
        });
        this.postsGrid.appendChild(fragment);
        this.currentPage++;
        if (end >= this.filteredPosts.length) {
            this.hasMore = false;
            this.noMore.style.display = 'block';
        }
    }

    loadMore() {
        if (this.isLoading || !this.hasMore) return;
        this.isLoading = true;
        this.loader.style.display = 'block';
        setTimeout(() => {
            this.renderNextPage();
            this.loader.style.display = 'none';
            this.isLoading = false;
        }, 300);
    }

    createPostCard(post) {
        const card = document.createElement('article');
        card.className = 'post-card';
        card.innerHTML = `
            <h2>${post.title}</h2>
            <p class="excerpt">${post.excerpt}</p>
            <div class="meta">
                <time datetime="${post.date}">${post.dateFormatted || post.date}</time>
                <div class="tags">${(post.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>
            </div>
        `;
        card.addEventListener('click', (e) => {
            e.preventDefault();
            this.openPost(post);
        });
        return card;
    }

    openPost(post) {
        history.pushState({ postUrl: post.url }, '', post.url);
        this.renderPostContent(post);
        this.overlay.style.display = 'flex';
    }

    renderPostContent(post) {
        this.postFullContent.innerHTML = `
            <h1>${post.title}</h1>
            <time class="date" datetime="${post.date}">${post.dateFormatted}</time>
            <div class="post-body">${post.body}</div>
        `;
    }

    closePost(silent = false) {
        this.overlay.style.display = 'none';
        if (!silent) {
            history.pushState(null, '', '/');
        }
    }

    handlePopState(event) {
        if (event.state && event.state.postUrl) {
            const post = this.posts.find(p => p.url === event.state.postUrl);
            if (post) {
                this.renderPostContent(post);
                this.overlay.style.display = 'flex';
            } else {
                this.overlay.style.display = 'flex';
                this.postFullContent.innerHTML = '<div class="loader"><div class="spinner"></div></div>';
                this.fetchAndDisplayPost(event.state.postUrl);
            }
        } else {
            this.closePost(true);
        }
    }

    async fetchAndDisplayPost(url) {
        try {
            const res = await fetch(url);
            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const article = doc.querySelector('.post-article');
            if (article) {
                this.postFullContent.innerHTML = article.innerHTML;
            } else {
                this.postFullContent.innerHTML = '<p>محتوای پست قابل نمایش نیست.</p>';
            }
        } catch (err) {
            this.postFullContent.innerHTML = '<p>خطا در بارگذاری پست.</p>';
        }
    }

    checkDirectPostAccess() {
        const path = window.location.pathname;
        if (path.startsWith('/posts/')) {
            const post = this.posts.find(p => p.url === path);
            if (post) {
                this.openPost(post);
            } else {
                this.overlay.style.display = 'flex';
                this.postFullContent.innerHTML = '<div class="loader"><div class="spinner"></div></div>';
                this.fetchAndDisplayPost(path);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BlogApp();
});
