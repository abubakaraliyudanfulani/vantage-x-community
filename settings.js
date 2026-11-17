
/* =====================================================
   VANTAGE X COMMUNITY
   SETTINGS & PRIVACY CENTRE

   JAVASCRIPT SECTION 1
   APPLICATION FOUNDATION
===================================================== */


/* =========================================
   1. APPLICATION CONFIGURATION
========================================= */

"use strict";

const VXSettings = {

  version: "1.0.0",

  initialized: false,

  currentUser: null,

  currentProfile: null,

  currentPage: "account",

  isSaving: false,

  selectors: {

    application: "#settingsApplication",

    sidebar: "#settingsSidebar",

    navigation: "#settingsNavigation",

    main: "#settingsMainContent",

    search: "#settingsSearch",

    mobileMenu: "#mobileSettingsMenu"

  }

};


/* =========================================
   2. APPLICATION ELEMENTS
========================================= */

const VXElements = {

  get(selector) {

    return document.querySelector(selector);

  },

  getAll(selector) {

    return document.querySelectorAll(selector);

  },

  byId(id) {

    return document.getElementById(id);

  },

  exists(selector) {

    return Boolean(document.querySelector(selector));

  }

};


/* =========================================
   3. APPLICATION UTILITIES
========================================= */

const VXUtils = {

  log(message, data = null) {

    console.info(
      "[VANTAGE X SETTINGS]",
      message,
      data ?? ""
    );

  },

  error(message, error = null) {

    console.error(
      "[VANTAGE X SETTINGS ERROR]",
      message,
      error ?? ""
    );

  },

  getValue(id) {

    const element = VXElements.byId(id);

    if (!element) return null;

    if (element.type === "checkbox") {

      return element.checked;

    }

    return element.value;

  },

  setValue(id, value) {

    const element = VXElements.byId(id);

    if (!element || value === undefined || value === null) {
      return;
    }

    if (element.type === "checkbox") {

      element.checked = Boolean(value);

      return;

    }

    element.value = value;

  },

  setText(id, value) {

    const element = VXElements.byId(id);

    if (!element) return;

    element.textContent = value ?? "";

  },

  setDisabled(id, disabled) {

    const element = VXElements.byId(id);

    if (!element) return;

    element.disabled = Boolean(disabled);

  },

  escapeHTML(value) {

    return String(value ?? "").replace(
      /[&<>"']/g,
      character => ({

        "&": "&amp;",

        "<": "&lt;",

        ">": "&gt;",

        '"': "&quot;",

        "'": "&#039;"

      })[character]
    );

  },

  isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      String(email ?? "").trim()
    );

  }

};


/* =========================================
   4. SUPABASE CONNECTION CHECK
========================================= */

const VXDatabase = {

  client: null,

  async initialize() {

    try {

      if (
        typeof supabaseClient === "undefined" ||
        !supabaseClient
      ) {

        throw new Error(
          "Supabase client was not found. Check supabase-config.js."
        );

      }

      this.client = supabaseClient;

      VXUtils.log(
        "Supabase connection is available."
      );

      return true;

    } catch (error) {

      VXUtils.error(
        "Supabase initialization failed.",
        error
      );

      return false;

    }

  },

  getClient() {

    return this.client;

  }

};


/* =========================================
   5. SETTINGS STATUS MESSAGES
========================================= */

const VXStatus = {

  show(elementId, message, type = "info") {

    const element = VXElements.byId(elementId);

    if (!element) return;

    element.textContent = message;

    element.classList.remove(
      "success",
      "error",
      "info"
    );

    element.classList.add(type);

    element.setAttribute(
      "role",
      type === "error" ? "alert" : "status"
    );

  },

  clear(elementId) {

    const element = VXElements.byId(elementId);

    if (!element) return;

    element.textContent = "";

    element.classList.remove(
      "success",
      "error",
      "info"
    );

  }

};


/* =========================================
   6. APPLICATION ERROR HANDLER
========================================= */

window.addEventListener(
  "error",
  event => {

    VXUtils.error(
      "An application error occurred.",
      event.error || event.message
    );

  }
);

window.addEventListener(
  "unhandledrejection",
  event => {

    VXUtils.error(
      "An asynchronous operation failed.",
      event.reason
    );

  }
);


/* =========================================
   7. INITIALIZATION GUARD
========================================= */

if (VXSettings.initialized) {

  VXUtils.log(
    "Settings application is already initialized."
  );

}



/* =====================================================
   VANTAGE X COMMUNITY
   JAVASCRIPT SECTION 2
   SETTINGS NAVIGATION SYSTEM
===================================================== */


/* =========================================
   1. SETTINGS PAGE CONFIGURATION
========================================= */

const VXNavigation = {

  pages: {

    account: {
      title: "Account Centre",
      description:
        "Manage your personal information and account details."
    },

    privacy: {
      title: "Privacy & Audience",
      description:
        "Control who can discover, follow and interact with you."
    },

    security: {
      title: "Security & Login",
      description:
        "Protect your account and manage your login security."
    },

    notifications: {
      title: "Notifications",
      description:
        "Manage the notifications and updates you receive."
    },

    content: {
      title: "Content & Interaction",
      description:
        "Control your content preferences and community interactions."
    },

    messaging: {
      title: "Messaging & Communication",
      description:
        "Manage your messages and communication preferences."
    },

    appearance: {
      title: "Appearance & Accessibility",
      description:
        "Personalise the appearance and accessibility of your experience."
    },

    data: {
      title: "Data & Account Management",
      description:
        "Manage your personal data, permissions and account lifecycle."
    },

    professional: {
      title: "Creator & Business Settings",
      description:
        "Manage professional tools, creator features and business information."
    }

  },


  /* =========================================
     2. OPEN A SETTINGS PAGE
  ========================================= */

  open(pageName, options = {}) {

    const page = this.pages[pageName];

    if (!page) {

      VXUtils.error(
        "Unknown settings page:",
        pageName
      );

      return false;

    }

    const targetPage = VXElements.byId(
      `page-${pageName}`
    );

    if (!targetPage) {

      VXUtils.error(
        `Settings page element not found: page-${pageName}`
      );

      return false;

    }


    /* HIDE ALL SETTINGS PAGES */

    VXElements.getAll(".settings-page").forEach(
      element => {

        element.classList.remove("active");

        element.setAttribute(
          "aria-hidden",
          "true"
        );

      }
    );


    /* SHOW SELECTED PAGE */

    targetPage.classList.add("active");

    targetPage.setAttribute(
      "aria-hidden",
      "false"
    );


    /* UPDATE NAVIGATION HIGHLIGHT */

    VXElements.getAll(
      ".settings-nav-item"
    ).forEach(button => {

      const isActive =
        button.dataset.settingPage === pageName;

      button.classList.toggle(
        "active",
        isActive
      );

      button.setAttribute(
        "aria-current",
        isActive ? "page" : "false"
      );

    });


    /* UPDATE PAGE HEADING */

    VXUtils.setText(
      "settingsPageTitle",
      page.title
    );

    VXUtils.setText(
      "settingsPageDescription",
      page.description
    );


    /* UPDATE APPLICATION STATE */

    VXSettings.currentPage = pageName;


    /* UPDATE BROWSER HISTORY */

    if (!options.skipHistory) {

      const url = new URL(
        window.location.href
      );

      url.hash = pageName;

      window.history.pushState(
        { settingsPage: pageName },
        "",
        url
      );

    }


    /* CLOSE MOBILE SIDEBAR */

    if (options.closeSidebar !== false) {

      VXMobileMenu.close();

    }


    VXUtils.log(
      `Opened settings page: ${pageName}`
    );

    return true;

  },


  /* =========================================
     3. INITIALIZE NAVIGATION
  ========================================= */

  initialize() {

    const navigation = VXElements.byId(
      "settingsNavigation"
    );

    if (!navigation) {

      VXUtils.error(
        "Settings navigation element was not found."
      );

      return;

    }


    /* ATTACH CLICK HANDLER */

    navigation.addEventListener(
      "click",
      event => {

        const button = event.target.closest(
          ".settings-nav-item"
        );

        if (!button) return;

        if (!navigation.contains(button)) return;

        const pageName =
          button.dataset.settingPage;

        this.open(pageName);

      }
    );


    /* SUPPORT BROWSER BACK AND FORWARD */

    window.addEventListener(
      "popstate",
      () => {

        const pageName =
          window.location.hash.replace("#", "");

        const targetPage =
          this.pages[pageName]
            ? pageName
            : "account";

        this.open(targetPage, {
          skipHistory: true
        });

      }
    );


    /* OPEN PAGE FROM URL HASH */

    const requestedPage =
      window.location.hash.replace("#", "");

    const initialPage =
      this.pages[requestedPage]
        ? requestedPage
        : "account";

    this.open(initialPage, {
      skipHistory: true,
      closeSidebar: false
    });


    VXUtils.log(
      "Settings navigation initialized."
    );

  }

};


/* =========================================
   4. MOBILE SIDEBAR CONTROLS
========================================= */

const VXMobileMenu = {

  isOpen: false,


  open() {

    const sidebar = VXElements.byId(
      "settingsSidebar"
    );

    const button = VXElements.byId(
      "mobileSettingsMenu"
    );

    if (!sidebar) return;

    sidebar.classList.add(
      "mobile-open"
    );

    this.isOpen = true;

    if (button) {

      button.setAttribute(
        "aria-expanded",
        "true"
      );

      button.setAttribute(
        "aria-label",
        "Close settings navigation"
      );

    }

  },


  close() {

    const sidebar = VXElements.byId(
      "settingsSidebar"
    );

    const button = VXElements.byId(
      "mobileSettingsMenu"
    );

    if (!sidebar) return;

    sidebar.classList.remove(
      "mobile-open"
    );

    this.isOpen = false;

    if (button) {

      button.setAttribute(
        "aria-expanded",
        "false"
      );

      button.setAttribute(
        "aria-label",
        "Open settings navigation"
      );

    }

  },


  toggle() {

    if (this.isOpen) {

      this.close();

    } else {

      this.open();

    }

  },


  initialize() {

    const button = VXElements.byId(
      "mobileSettingsMenu"
    );

    if (!button) return;

    button.addEventListener(
      "click",
      () => this.toggle()
    );


    /* CLOSE SIDEBAR WITH ESCAPE KEY */

    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape" &&
          this.isOpen
        ) {

          this.close();

          button.focus();

        }

      }
    );


    /* CLOSE SIDEBAR WHEN SCREEN RESIZES */

    window.addEventListener(
      "resize",
      () => {

        if (window.innerWidth > 650) {

          this.close();

        }

      }
    );


    VXUtils.log(
      "Mobile navigation initialized."
    );

  }

};


/* =========================================
   5. INITIALIZE NAVIGATION SYSTEM
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    VXNavigation.initialize();

    VXMobileMenu.initialize();

  }
);


/* =========================================
   JAVASCRIPT SECTION 3
   INTELLIGENT SETTINGS SEARCH
========================================= */

const VXSettingsSearch = {

    input: null,
    resultsPanel: null,
    results: [],
    activeIndex: -1,

    /* -------------------------------------
       INITIALIZE SEARCH
    ------------------------------------- */

    initialize() {

        this.input = VXElements.byId("settingsSearch");

        if (!this.input) {
            VXUtils.log("Settings search field was not found.");
            return;
        }

        this.createResultsPanel();
        this.attachEvents();

        VXUtils.log("Intelligent settings search initialized.");
    },


    /* -------------------------------------
       CREATE SEARCH RESULTS PANEL
    ------------------------------------- */

    createResultsPanel() {

        const existing = document.getElementById(
            "settingsSearchResults"
        );

        if (existing) {
            this.resultsPanel = existing;
            return;
        }

        const wrapper = this.input.parentElement;

        if (wrapper) {
            wrapper.style.position = "relative";
        }

        this.resultsPanel = document.createElement("div");

        this.resultsPanel.id = "settingsSearchResults";

        this.resultsPanel.setAttribute("role", "listbox");
        this.resultsPanel.setAttribute(
            "aria-label",
            "Settings search results"
        );

        Object.assign(this.resultsPanel.style, {

            position: "absolute",
            top: "calc(100% + 8px)",
            left: "0",
            right: "0",
            zIndex: "9999",
            display: "none",
            maxHeight: "360px",
            overflowY: "auto",
            background: "#ffffff",
            border: "1px solid #e2e6ed",
            borderRadius: "12px",
            boxShadow: "0 12px 35px rgba(0,0,0,0.14)",
            padding: "8px"

        });

        wrapper.appendChild(this.resultsPanel);
    },


    /* -------------------------------------
       NORMALIZE SEARCH TEXT
    ------------------------------------- */

    normalize(value) {

        return String(value || "")
            .toLowerCase()
            .trim()
            .replace(/\s+/g, " ");

    },


    /* -------------------------------------
       BUILD SETTINGS SEARCH INDEX
    ------------------------------------- */

    buildIndex() {

        const pages = document.querySelectorAll(
            ".settings-page"
        );

        const index = [];

        pages.forEach(page => {

            const pageId = page.id.replace("page-", "");

            const navigationItem = document.querySelector(
                `[data-setting-page="${pageId}"]`
            );

            const pageTitle =
                navigationItem?.textContent?.trim() ||
                page.querySelector("h2")?.textContent?.trim() ||
                pageId;

            const pageDescription =
                page.querySelector(".settings-page-intro")?.textContent ||
                page.querySelector(".page-intro")?.textContent ||
                "";

            /* Add category itself */

            index.push({

                page: pageId,
                title: pageTitle,
                description: pageDescription,
                element: page,
                keywords: this.normalize(
                    pageTitle + " " + pageDescription + " " + pageId
                )

            });


            /* Search individual settings */

            const elements = page.querySelectorAll(
                "label, h2, h3, h4, p, button, " +
                "select, input, textarea, " +
                ".settings-toggle-row, .settings-select-row, " +
                ".settings-info-row"
            );

            elements.forEach(element => {

                if (
                    element.closest("#settingsSearchResults") ||
                    element.disabled
                ) {
                    return;
                }

                const label =
                    element.getAttribute("aria-label") ||
                    element.getAttribute("placeholder") ||
                    element.getAttribute("title") ||
                    element.textContent ||
                    element.value ||
                    "";

                const description =
                    element.getAttribute("data-description") || "";

                const keywords = this.normalize(
                    label + " " +
                    description + " " +
                    element.id + " " +
                    element.name
                );

                if (!keywords || keywords.length < 2) {
                    return;
                }

                index.push({

                    page: pageId,
                    title: label.trim() || "Settings option",
                    description: pageTitle,
                    element: element,
                    keywords: keywords

                });

            });

        });

        return index;
    },


    /* -------------------------------------
       SEARCH SETTINGS
    ------------------------------------- */

    search(query) {

        const searchTerm = this.normalize(query);

        if (searchTerm.length < 2) {

            this.hideResults();
            return;

        }

        const index = this.buildIndex();

        const matches = [];

        index.forEach(item => {

            let score = 0;

            if (item.keywords === searchTerm) {
                score += 100;
            }

            if (item.keywords.startsWith(searchTerm)) {
                score += 50;
            }

            if (item.title.toLowerCase().includes(searchTerm)) {
                score += 35;
            }

            if (item.keywords.includes(searchTerm)) {
                score += 20;
            }

            const searchWords = searchTerm.split(" ");

            searchWords.forEach(word => {

                if (
                    word.length > 1 &&
                    item.keywords.includes(word)
                ) {
                    score += 5;
                }

            });

            if (score > 0) {

                matches.push({

                    ...item,
                    score: score

                });

            }

        });


        /* Sort strongest matches first */

        matches.sort((a, b) => b.score - a.score);


        /* Remove duplicate results */

        const uniqueMatches = [];
        const seen = new Set();

        matches.forEach(item => {

            const key =
                item.page + "-" +
                item.title.toLowerCase();

            if (!seen.has(key)) {

                seen.add(key);
                uniqueMatches.push(item);

            }

        });

        this.results = uniqueMatches.slice(0, 8);
        this.activeIndex = -1;

        this.renderResults();
    },


    /* -------------------------------------
       RENDER SEARCH RESULTS
    ------------------------------------- */

    renderResults() {

        if (!this.resultsPanel) return;

        this.resultsPanel.innerHTML = "";

        if (this.results.length === 0) {

            const empty = document.createElement("div");

            empty.textContent =
                "No matching settings found.";

            Object.assign(empty.style, {

                padding: "16px",
                color: "#687386",
                fontSize: "13px",
                textAlign: "center"

            });

            this.resultsPanel.appendChild(empty);

            this.showResults();

            return;
        }


        const heading = document.createElement("div");

        heading.textContent = "SEARCH RESULTS";

        Object.assign(heading.style, {

            padding: "8px 10px",
            fontSize: "10px",
            fontWeight: "700",
            letterSpacing: "1px",
            color: "#8a94a5"

        });

        this.resultsPanel.appendChild(heading);


        this.results.forEach((result, index) => {

            const button = document.createElement("button");

            button.type = "button";

            button.setAttribute("role", "option");

            button.setAttribute(
                "aria-selected",
                index === this.activeIndex ? "true" : "false"
            );

            Object.assign(button.style, {

                display: "block",
                width: "100%",
                border: "0",
                borderRadius: "8px",
                padding: "11px 12px",
                marginBottom: "3px",
                textAlign: "left",
                cursor: "pointer",
                background: "#ffffff",
                color: "#17243a"

            });


            const title = document.createElement("div");

            title.textContent = result.title;

            Object.assign(title.style, {

                fontSize: "13px",
                fontWeight: "700",
                marginBottom: "4px"

            });


            const description = document.createElement("div");

            description.textContent =
                result.description || "Settings option";

            Object.assign(description.style, {

                fontSize: "11px",
                color: "#7b8493"

            });


            button.appendChild(title);
            button.appendChild(description);


            button.addEventListener("mouseenter", () => {

                this.activeIndex = index;
                this.updateActiveResult();

            });


            button.addEventListener("click", () => {

                this.openResult(result);

            });


            this.resultsPanel.appendChild(button);

        });

        this.showResults();
        this.updateActiveResult();
    },


    /* -------------------------------------
       OPEN SELECTED SEARCH RESULT
    ------------------------------------- */

    openResult(result) {

        if (!result || !result.page) return;

        if (
            typeof VXNavigation === "undefined" ||
            typeof VXNavigation.open !== "function"
        ) {
            VXUtils.error(
                "Settings navigation is unavailable."
            );
            return;
        }

        VXNavigation.open(result.page);

        this.input.value = "";

        this.hideResults();

        if (
            result.element &&
            result.element.id !== "page-" + result.page
        ) {

            setTimeout(() => {

                result.element.scrollIntoView({

                    behavior: "smooth",
                    block: "center"

                });

            }, 150);

        }

    },


    /* -------------------------------------
       KEYBOARD NAVIGATION
    ------------------------------------- */

    updateActiveResult() {

        if (!this.resultsPanel) return;

        const buttons = this.resultsPanel.querySelectorAll(
            "button"
        );

        buttons.forEach((button, index) => {

            const active = index === this.activeIndex;

            button.style.background = active
                ? "#edf1f7"
                : "#ffffff";

            button.setAttribute(
                "aria-selected",
                active ? "true" : "false"
            );

        });

    },


    handleKeyboard(event) {

        if (!this.results.length) {

            if (event.key === "Escape") {
                this.hideResults();
            }

            return;
        }

        if (event.key === "ArrowDown") {

            event.preventDefault();

            this.activeIndex = Math.min(
                this.activeIndex + 1,
                this.results.length - 1
            );

            this.updateActiveResult();

        }

        else if (event.key === "ArrowUp") {

            event.preventDefault();

            this.activeIndex = Math.max(
                this.activeIndex - 1,
                0
            );

            this.updateActiveResult();

        }

        else if (event.key === "Enter") {

            event.preventDefault();

            if (this.activeIndex >= 0) {

                this.openResult(
                    this.results[this.activeIndex]
                );

            } else if (this.results.length > 0) {

                this.openResult(this.results[0]);

            }

        }

        else if (event.key === "Escape") {

            this.hideResults();

        }

    },


    /* -------------------------------------
       SHOW AND HIDE RESULTS
    ------------------------------------- */

    showResults() {

        if (!this.resultsPanel) return;

        this.resultsPanel.style.display = "block";

    },


    hideResults() {

        if (!this.resultsPanel) return;

        this.resultsPanel.style.display = "none";

        this.activeIndex = -1;

    },


    /* -------------------------------------
       ATTACH SEARCH EVENTS
    ------------------------------------- */

    attachEvents() {

        this.input.addEventListener("input", () => {

            this.search(this.input.value);

        });


        this.input.addEventListener("keydown", event => {

            this.handleKeyboard(event);

        });


        this.input.addEventListener("focus", () => {

            if (this.input.value.trim().length >= 2) {

                this.search(this.input.value);

            }

        });


        document.addEventListener("click", event => {

            if (
                !this.input.contains(event.target) &&
                !this.resultsPanel.contains(event.target)
            ) {

                this.hideResults();

            }

        });


        this.input.setAttribute(
            "aria-autocomplete",
            "list"
        );

        this.input.setAttribute(
            "aria-controls",
            "settingsSearchResults"
        );

    }

};


/* -----------------------------------------
   INITIALIZE INTELLIGENT SEARCH
----------------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        VXSettingsSearch.initialize();

    }
);



/* =========================================
   JAVASCRIPT SECTION 4
   AUTHENTICATION & PROFILE LOADING
========================================= */

const VXAuth = {

    session: null,
    user: null,
    profile: null,
    accountSettings: null,
    initialized: false,
    loading: false,

    /* -------------------------------------
       INITIALIZE AUTHENTICATION
    ------------------------------------- */

    async initialize() {

        if (this.initialized) return;

        this.initialized = true;

        const client = VXDatabase.getClient();

        if (!client) {

            VXUtils.error(
                "Authentication unavailable: Supabase is not connected."
            );

            this.showAccessMessage(
                "Unable to connect to the account service. Please try again later."
            );

            return;
        }

        try {

            /* GET CURRENT SESSION */

            const {
                data,
                error
            } = await client.auth.getSession();

            if (error) throw error;

            this.session = data.session || null;
            this.user = this.session?.user || null;

            if (this.user) {

                await this.loadMemberData();

            } else {

                this.showAccessMessage(
                    "Please sign in to your VANTAGE X COMMUNITY account to manage your settings."
                );

            }


            /* LISTEN FOR LOGIN AND LOGOUT CHANGES */

            client.auth.onAuthStateChange(
                (event, session) => {

                    setTimeout(async () => {

                        try {

                            this.session = session || null;
                            this.user = session?.user || null;

                            if (this.user) {

                                await this.loadMemberData();

                            } else {

                                this.clearMemberData();

                                this.showAccessMessage(
                                    "Your session has ended. Please sign in again to access your settings."
                                );

                            }

                        } catch (error) {

                            VXUtils.error(
                                "Authentication state update failed.",
                                error
                            );

                        }

                    }, 0);

                }
            );


            VXUtils.log(
                "Authentication system initialized."
            );

        } catch (error) {

            VXUtils.error(
                "Authentication initialization failed.",
                error
            );

            this.showAccessMessage(
                "We could not verify your login session. Please refresh the page and try again."
            );

        }

    },


    /* -------------------------------------
       LOAD MEMBER DATA
    ------------------------------------- */

    async loadMemberData() {

        if (!this.user || this.loading) return;

        this.loading = true;

        try {

            await this.loadProfile();

            await this.loadAccountSettings();

            this.updateSidebar();

            this.hideAccessMessage();

            VXUtils.log(
                "Member account information loaded."
            );

        } catch (error) {

            VXUtils.error(
                "Unable to load member information.",
                error
            );

            this.showAccessMessage(
                "Your account was verified, but some profile information could not be loaded."
            );

        } finally {

            this.loading = false;

        }

    },


    /* -------------------------------------
       LOAD AUTHENTICATED PROFILE
    ------------------------------------- */

    async loadProfile() {

        const client = VXDatabase.getClient();

        if (!client || !this.user) return null;

        const {
            data,
            error
        } = await client
            .from("profiles")
            .select(
                "id, full_name, username, avatar_url"
            )
            .eq("id", this.user.id)
            .maybeSingle();

        if (error) throw error;

        this.profile = data || null;

        VXSettings.currentUser = this.user;
        VXSettings.currentProfile = this.profile;

        return this.profile;

    },


    /* -------------------------------------
       LOAD ACCOUNT PREFERENCES
    ------------------------------------- */

    async loadAccountSettings() {

        const client = VXDatabase.getClient();

        if (!client || !this.user) return null;

        const {
            data,
            error
        } = await client
            .from("account_settings")
            .select(
                "user_id, is_private, email_notifications, push_notifications"
            )
            .eq("user_id", this.user.id)
            .maybeSingle();

        if (error) throw error;

        this.accountSettings = data || null;

        return this.accountSettings;

    },


    /* -------------------------------------
       UPDATE SIDEBAR PROFILE
    ------------------------------------- */

    updateSidebar() {

        const profile = this.profile;

        if (!profile) {

            VXUtils.setText(
                "settingsMemberName",
                "Community Member"
            );

            VXUtils.setText(
                "settingsMemberUsername",
                this.user?.email || ""
            );

            return;

        }

        VXUtils.setText(
            "settingsMemberName",
            profile.full_name || "Community Member"
        );

        VXUtils.setText(
            "settingsMemberUsername",
            profile.username
                ? "@" + profile.username
                : ""
        );


        /* PROFILE AVATAR */

        const avatar = VXElements.byId(
            "settingsMemberAvatar"
        );

        if (avatar && profile.avatar_url) {

            avatar.src = profile.avatar_url;

            avatar.alt =
                profile.full_name || "Member profile picture";

            avatar.onerror = () => {

                avatar.removeAttribute("src");

            };

        }


        /* ACCOUNT TYPE */

        VXUtils.setText(
            "settingsMemberType",
            "Community Member"
        );

    },


    /* -------------------------------------
       ACCESS MESSAGE
    ------------------------------------- */

    showAccessMessage(message) {

        const main = VXElements.byId(
            "settingsMainContent"
        );

        if (!main) return;

        let notice = VXElements.byId(
            "settingsAccessNotice"
        );

        if (!notice) {

            notice = document.createElement("div");

            notice.id = "settingsAccessNotice";

            notice.setAttribute("role", "status");

            Object.assign(notice.style, {

                padding: "16px",
                marginBottom: "20px",
                borderRadius: "12px",
                border: "1px solid #e5c98c",
                background: "#fff8e9",
                color: "#664b19",
                fontSize: "14px",
                lineHeight: "1.6"

            });

            main.prepend(notice);

        }

        notice.textContent = message;

        notice.style.display = "block";

    },


    /* -------------------------------------
       HIDE ACCESS MESSAGE
    ------------------------------------- */

    hideAccessMessage() {

        const notice = VXElements.byId(
            "settingsAccessNotice"
        );

        if (notice) {

            notice.style.display = "none";

        }

    },


    /* -------------------------------------
       CLEAR MEMBER INFORMATION
    ------------------------------------- */

    clearMemberData() {

        this.session = null;
        this.user = null;
        this.profile = null;
        this.accountSettings = null;

        VXSettings.currentUser = null;
        VXSettings.currentProfile = null;

        VXUtils.setText(
            "settingsMemberName",
            "Not signed in"
        );

        VXUtils.setText(
            "settingsMemberUsername",
            ""
        );

        VXUtils.setText(
            "settingsMemberType",
            "Guest"
        );

        const avatar = VXElements.byId(
            "settingsMemberAvatar"
        );

        if (avatar) {

            avatar.removeAttribute("src");

        }

    },


    /* -------------------------------------
       GET AUTHENTICATED USER
    ------------------------------------- */

    getUser() {

        return this.user;

    },


    /* -------------------------------------
       GET MEMBER PROFILE
    ------------------------------------- */

    getProfile() {

        return this.profile;

    },


    /* -------------------------------------
       GET ACCOUNT PREFERENCES
    ------------------------------------- */

    getAccountSettings() {

        return this.accountSettings;

    },


    /* -------------------------------------
       CHECK AUTHENTICATION
    ------------------------------------- */

    isAuthenticated() {

        return Boolean(
            this.user && this.session
        );

    }

};


/* -----------------------------------------
   INITIALIZE DATABASE AND AUTHENTICATION
----------------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const connected =
            await VXDatabase.initialize();

        if (!connected) {

            VXAuth.showAccessMessage(
                "The account service is currently unavailable."
            );

            return;

        }

        await VXAuth.initialize();

    }
);




          


