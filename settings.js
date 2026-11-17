
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



/* =========================================
   JAVASCRIPT SECTION 5
   ACCOUNT CENTRE & PERSONAL INFORMATION
========================================= */

const VXAccountCentre = {

    initialized: false,

    /* -------------------------------------
       INITIALIZE ACCOUNT CENTRE
    ------------------------------------- */

    initialize() {

        if (this.initialized) return;

        this.initialized = true;

        this.attachEvents();

        this.loadAccountInformation();

        VXUtils.log(
            "Account Centre initialized."
        );

    },


    /* -------------------------------------
       CHECK AUTHENTICATED MEMBER
    ------------------------------------- */

    getAuthenticatedUser() {

        if (
            typeof VXAuth === "undefined" ||
            !VXAuth.isAuthenticated()
        ) {

            VXStatus.show(
                "personalInformationStatus",
                "Please sign in before changing your account information.",
                "error"
            );

            return null;

        }

        return VXAuth.getUser();

    },


    /* -------------------------------------
       LOAD ACCOUNT INFORMATION
    ------------------------------------- */

    async loadAccountInformation() {

        const user = this.getAuthenticatedUser();

        if (!user) return;

        const client = VXDatabase.getClient();

        if (!client) return;

        try {

            const {
                data,
                error
            } = await client
                .from("profiles")
                .select(
                    "id, full_name, username, bio, avatar_url, created_at"
                )
                .eq("id", user.id)
                .maybeSingle();

            if (error) throw error;

            if (!data) {

                VXStatus.show(
                    "personalInformationStatus",
                    "Your profile record could not be found.",
                    "error"
                );

                return;

            }

            /* UPDATE APPLICATION PROFILE */

            VXAuth.profile = data;

            VXSettings.currentProfile = data;


            /* PERSONAL INFORMATION */

            VXUtils.setValue(
                "accountFullName",
                data.full_name || ""
            );

            VXUtils.setValue(
                "accountUsername",
                data.username || ""
            );

            VXUtils.setValue(
                "accountBio",
                data.bio || ""
            );


            /* CONTACT INFORMATION */

            VXUtils.setText(
                "accountEmailDisplay",
                user.email || "No email address available"
            );

            VXUtils.setText(
                "accountPhoneDisplay",
                user.phone || "Not added"
            );


            /* ACCOUNT IDENTITY */

            VXUtils.setText(
                "accountTypeDisplay",
                "Community Member"
            );

            VXUtils.setText(
                "accountStatusDisplay",
                user.email_confirmed_at
                    ? "Active — Email verified"
                    : "Active — Email verification pending"
            );


            /* REGISTRATION DATE */

            if (data.created_at) {

                const createdDate = new Date(
                    data.created_at
                );

                VXUtils.setText(
                    "accountCreatedDisplay",
                    createdDate.toLocaleDateString(
                        undefined,
                        {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        }
                    )
                );

            } else {

                VXUtils.setText(
                    "accountCreatedDisplay",
                    "Date unavailable"
                );

            }


            /* SIDEBAR PROFILE */

            VXAuth.updateSidebar();


            VXUtils.log(
                "Account information loaded successfully."
            );

        } catch (error) {

            VXUtils.error(
                "Account information could not be loaded.",
                error
            );

            VXStatus.show(
                "personalInformationStatus",
                "Unable to load your account information. Please refresh and try again.",
                "error"
            );

        }

    },


    /* -------------------------------------
       VALIDATE PERSONAL INFORMATION
    ------------------------------------- */

    validatePersonalInformation() {

        const fullName = String(
            VXUtils.getValue("accountFullName") || ""
        ).trim();

        const username = String(
            VXUtils.getValue("accountUsername") || ""
        )
        .trim()
        .toLowerCase();

        const bio = String(
            VXUtils.getValue("accountBio") || ""
        ).trim();


        if (fullName.length < 2) {

            return {
                valid: false,
                message: "Please enter a valid full name."
            };

        }

        if (fullName.length > 100) {

            return {
                valid: false,
                message: "Your full name is too long."
            };

        }

        if (!/^[a-z0-9._]{3,30}$/.test(username)) {

            return {
                valid: false,
                message:
                    "Username must contain 3–30 characters using lowercase letters, numbers, dots or underscores."
            };

        }

        if (
            username.startsWith(".") ||
            username.endsWith(".") ||
            username.includes("..")
        ) {

            return {
                valid: false,
                message: "Please enter a valid username."
            };

        }

        if (bio.length > 500) {

            return {
                valid: false,
                message: "Your biography cannot exceed 500 characters."
            };

        }

        return {

            valid: true,

            data: {
                full_name: fullName,
                username: username,
                bio: bio
            }

        };

    },


    /* -------------------------------------
       SAVE PERSONAL INFORMATION
    ------------------------------------- */

    async savePersonalInformation() {

        const user = this.getAuthenticatedUser();

        if (!user) return;

        const client = VXDatabase.getClient();

        if (!client) return;


        const validation =
            this.validatePersonalInformation();

        if (!validation.valid) {

            VXStatus.show(
                "personalInformationStatus",
                validation.message,
                "error"
            );

            return;

        }


        const button = VXElements.byId(
            "savePersonalInformation"
        );

        if (button) {

            button.disabled = true;
            button.textContent = "Saving...";

        }


        VXStatus.clear(
            "personalInformationStatus"
        );


        try {

            const {
                data,
                error
            } = await client
                .from("profiles")
                .update({

                    full_name:
                        validation.data.full_name,

                    username:
                        validation.data.username,

                    bio:
                        validation.data.bio

                })
                .eq("id", user.id)
                .select(
                    "id, full_name, username, bio, avatar_url, created_at"
                )
                .single();

            if (error) throw error;


            /* UPDATE LOCAL PROFILE */

            VXAuth.profile = data;

            VXSettings.currentProfile = data;


            /* UPDATE SIDEBAR */

            VXAuth.updateSidebar();


            /* REPORT DATABASE COMPATIBILITY */

            const location =
                VXUtils.getValue("accountLocation");

            const website =
                VXUtils.getValue("accountWebsite");

            const hasUnstoredFields =
                Boolean(
                    String(location || "").trim() ||
                    String(website || "").trim()
                );


            if (hasUnstoredFields) {

                VXStatus.show(
                    "personalInformationStatus",
                    "Your name, username and biography were saved. Location and website still require database fields before they can be saved.",
                    "success"
                );

            } else {

                VXStatus.show(
                    "personalInformationStatus",
                    "Your personal information was saved successfully.",
                    "success"
                );

            }


            VXUtils.log(
                "Personal information updated."
            );

        } catch (error) {

            VXUtils.error(
                "Unable to save personal information.",
                error
            );


            let message =
                "Unable to save your information. Please try again.";


            if (
                error.code === "23505" ||
                error.message?.toLowerCase().includes("duplicate")
            ) {

                message =
                    "That username is already in use. Please choose another.";

            }

            else if (error.code === "42501") {

                message =
                    "Permission denied. Please check your account profile security policies.";

            }


            VXStatus.show(
                "personalInformationStatus",
                message,
                "error"
            );

        } finally {

            if (button) {

                button.disabled = false;

                button.textContent =
                    "Save Personal Information";

            }

        }

    },


    /* -------------------------------------
       CHANGE EMAIL ADDRESS
    ------------------------------------- */

    async changeEmail() {

        const user = this.getAuthenticatedUser();

        if (!user) return;

        const newEmail = prompt(
            "Enter the new email address you want to use:"
        );

        if (newEmail === null) return;

        const email = newEmail.trim().toLowerCase();

        if (!VXUtils.isValidEmail(email)) {

            alert(
                "Please enter a valid email address."
            );

            return;

        }

        if (email === user.email?.toLowerCase()) {

            alert(
                "This is already your current email address."
            );

            return;

        }

        const confirmed = confirm(
            "Request an email change to " +
            email +
            "?\n\nSupabase may require you to confirm the change through an email sent to you."
        );

        if (!confirmed) return;


        try {

            const client = VXDatabase.getClient();

            const {
                data,
                error
            } = await client.auth.updateUser({

                email: email

            });

            if (error) throw error;


            VXStatus.show(
                "personalInformationStatus",
                "Email change requested. Follow the confirmation instructions sent by Supabase.",
                "success"
            );

            VXUtils.log(
                "Email change requested."
            );

        } catch (error) {

            VXUtils.error(
                "Email update failed.",
                error
            );

            alert(
                error.message ||
                "Unable to request an email change."
            );

        }

    },


    /* -------------------------------------
       PHONE MANAGEMENT
    ------------------------------------- */

    managePhone() {

        alert(
            "Phone number management is not yet connected. It will be enabled after the phone verification workflow and database configuration are completed."
        );

    },


    /* -------------------------------------
       ACCOUNT DEACTIVATION
    ------------------------------------- */

    deactivateAccount() {

        alert(
            "Account deactivation is not yet available. This operation requires a secure server-side workflow to protect your account and its data."
        );

    },


    /* -------------------------------------
       ACCOUNT DELETION
    ------------------------------------- */

    deleteAccount() {

        alert(
            "Account deletion is not yet available. Permanent deletion must be handled through a secure server-side process with identity verification and appropriate data-retention safeguards."
        );

    },


    /* -------------------------------------
       ATTACH BUTTON EVENTS
    ------------------------------------- */

    attachEvents() {

        const saveButton = VXElements.byId(
            "savePersonalInformation"
        );

        const emailButton = VXElements.byId(
            "changeEmailButton"
        );

        const phoneButton = VXElements.byId(
            "managePhoneButton"
        );

        const deactivateButton = VXElements.byId(
            "deactivateAccountButton"
        );

        const deleteButton = VXElements.byId(
            "deleteAccountButton"
        );


        if (saveButton) {

            saveButton.addEventListener(
                "click",
                () => this.savePersonalInformation()
            );

        }

        if (emailButton) {

            emailButton.addEventListener(
                "click",
                () => this.changeEmail()
            );

        }

        if (phoneButton) {

            phoneButton.addEventListener(
                "click",
                () => this.managePhone()
            );

        }

        if (deactivateButton) {

            deactivateButton.addEventListener(
                "click",
                () => this.deactivateAccount()
            );

        }

        if (deleteButton) {

            deleteButton.addEventListener(
                "click",
                () => this.deleteAccount()
            );

        }

    }

};


/* -----------------------------------------
   INITIALIZE ACCOUNT CENTRE
----------------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        VXAccountCentre.initialize();

    }
);



/* =========================================
   JAVASCRIPT SECTION 6
   PRIVACY & AUDIENCE MANAGEMENT
========================================= */

const VXPrivacy = {

    initialized: false,

    loading: false,

    saving: false,

    settings: {},

    /* -------------------------------------
       PRIVACY CONTROL DEFINITIONS
    ------------------------------------- */

    controls: {

        toggles: [
            "privacyPrivateAccount",
            "privacySearchVisibility",
            "privacyProfileDiscovery",
            "privacyActivityStatus",
            "privacyShowFollowers",
            "privacyShowFollowing",
            "privacyAllowReposts",
            "privacyManualTagApproval",
            "privacyProfileVisitHistory",
            "privacyShowLikes"
        ],

        selects: {

            privacyWhoCanFollow: [
                "everyone",
                "approved"
            ],

            privacyDefaultAudience: [
                "public",
                "followers",
                "private"
            ],

            privacyWhoCanComment: [
                "everyone",
                "followers",
                "following",
                "none"
            ],

            privacyWhoCanShare: [
                "everyone",
                "followers",
                "none"
            ],

            privacyWhoCanMention: [
                "everyone",
                "followers",
                "following",
                "none"
            ],

            privacyWhoCanTag: [
                "everyone",
                "followers",
                "following",
                "none"
            ]

        }

    },


    /* -------------------------------------
       INITIALIZE PRIVACY SYSTEM
    ------------------------------------- */

    initialize() {

        if (this.initialized) return;

        this.initialized = true;

        this.attachEvents();

        this.loadPrivacyPreferences();

        VXUtils.log(
            "Privacy and Audience system initialized."
        );

    },


    /* -------------------------------------
       GET AUTHENTICATED MEMBER
    ------------------------------------- */

    getUser() {

        if (
            typeof VXAuth === "undefined" ||
            !VXAuth.isAuthenticated()
        ) {

            return null;

        }

        return VXAuth.getUser();

    },


    /* -------------------------------------
       READ PRIVACY CONTROLS
    ------------------------------------- */

    collectPreferences() {

        const preferences = {};

        this.controls.toggles.forEach(id => {

            const element = VXElements.byId(id);

            if (element) {

                preferences[id] = element.checked;

            }

        });


        Object.keys(this.controls.selects).forEach(id => {

            const element = VXElements.byId(id);

            if (element) {

                preferences[id] = element.value;

            }

        });

        return preferences;

    },


    /* -------------------------------------
       VALIDATE PRIVACY CONTROLS
    ------------------------------------- */

    validatePreferences(preferences) {

        for (const id of this.controls.toggles) {

            if (typeof preferences[id] !== "boolean") {

                return {
                    valid: false,
                    message: "A privacy switch contains an invalid value."
                };

            }

        }


        for (
            const [id, allowedValues]
            of Object.entries(this.controls.selects)
        ) {

            if (!allowedValues.includes(preferences[id])) {

                return {
                    valid: false,
                    message: "Please select a valid option for " + id + "."
                };

            }

        }


        return {
            valid: true
        };

    },


    /* -------------------------------------
       LOAD PRIVACY PREFERENCES
    ------------------------------------- */

    async loadPrivacyPreferences() {

        if (this.loading) return;

        this.loading = true;

        try {

            /* ENSURE DATABASE IS AVAILABLE */

            const connected =
                await VXDatabase.initialize();

            if (!connected) {

                throw new Error(
                    "The database connection is unavailable."
                );

            }


            const client = VXDatabase.getClient();

            /* GET CURRENT AUTHENTICATED SESSION */

            const {
                data: sessionData,
                error: sessionError
            } = await client.auth.getSession();

            if (sessionError) throw sessionError;

            const user = sessionData.session?.user;

            if (!user) {

                VXStatus.show(
                    "privacySettingsStatus",
                    "Please sign in to load your privacy preferences.",
                    "error"
                );

                return;

            }


            /* LOAD CONFIRMED DATABASE COLUMN */

            const {
                data,
                error
            } = await client
                .from("account_settings")
                .select(
                    "user_id, is_private"
                )
                .eq("user_id", user.id)
                .maybeSingle();

            if (error) throw error;

            if (data) {

                this.settings.is_private =
                    Boolean(data.is_private);

                VXUtils.setValue(
                    "privacyPrivateAccount",
                    data.is_private
                );

            }

            this.settings.user_id = user.id;

            VXUtils.log(
                "Privacy preferences loaded."
            );


            /* CLEAR PREVIOUS STATUS */

            VXStatus.clear(
                "privacySettingsStatus"
            );

        } catch (error) {

            VXUtils.error(
                "Privacy preferences could not be loaded.",
                error
            );

            VXStatus.show(
                "privacySettingsStatus",
                "Unable to load saved privacy preferences. Please try again.",
                "error"
            );

        } finally {

            this.loading = false;

        }

    },


    /* -------------------------------------
       SAVE PRIVACY PREFERENCES
    ------------------------------------- */

    async savePrivacyPreferences() {

        if (this.saving) return;

        const user = this.getUser();

        if (!user) {

            VXStatus.show(
                "privacySettingsStatus",
                "Please sign in before saving privacy settings.",
                "error"
            );

            return;

        }


        const preferences =
            this.collectPreferences();

        const validation =
            this.validatePreferences(preferences);

        if (!validation.valid) {

            VXStatus.show(
                "privacySettingsStatus",
                validation.message,
                "error"
            );

            return;

        }


        const button = VXElements.byId(
            "savePrivacyPreferences"
        );

        this.saving = true;

        if (button) {

            button.disabled = true;

            button.textContent = "Saving...";

        }


        try {

            const client = VXDatabase.getClient();

            if (!client) {

                throw new Error(
                    "Database connection unavailable."
                );

            }


            /*
              CURRENTLY CONFIRMED DATABASE FIELD:

              account_settings.is_private

              Other privacy preferences will be
              connected after their database schema
              and enforcement policies are created.
            */

            const {
                data,
                error
            } = await client
                .from("account_settings")
                .update({

                    is_private:
                        preferences.privacyPrivateAccount

                })
                .eq("user_id", user.id)
                .select("user_id, is_private")
                .maybeSingle();

            if (error) throw error;

            if (!data) {

                throw new Error(
                    "No existing account settings record was updated. Please check that your account has an account_settings record and the required Supabase permissions."
                );

            }


            /* UPDATE LOCAL SETTINGS */

            this.settings.is_private =
                data.is_private;

            this.settings.user_id =
                data.user_id;


            /*
              DO NOT CLAIM ALL SETTINGS ARE SAVED.

              Only is_private is currently confirmed
              in the existing database schema.
            */

            VXStatus.show(
                "privacySettingsStatus",
                "Private account preference saved successfully. Other privacy preferences are displayed but require additional database configuration before they can be permanently saved.",
                "success"
            );


            VXUtils.log(
                "Private account preference saved."
            );

        } catch (error) {

            VXUtils.error(
                "Privacy settings could not be saved.",
                error
            );

            VXStatus.show(
                "privacySettingsStatus",
                error.message ||
                "Unable to save privacy settings.",
                "error"
            );

        } finally {

            this.saving = false;

            if (button) {

                button.disabled = false;

                button.textContent =
                    "Save Privacy Settings";

            }

        }

    },


    /* -------------------------------------
       BLOCKED ACCOUNTS
    ------------------------------------- */

    manageBlockedAccounts() {

        VXStatus.show(
            "privacySettingsStatus",
            "Blocked account management will be connected to the community blocking system.",
            "info"
        );

    },


    /* -------------------------------------
       RESTRICTED ACCOUNTS
    ------------------------------------- */

    manageRestrictedAccounts() {

        VXStatus.show(
            "privacySettingsStatus",
            "Restricted account management will be connected to the community restriction system.",
            "info"
        );

    },


    /* -------------------------------------
       ATTACH PRIVACY EVENTS
    ------------------------------------- */

    attachEvents() {

        const saveButton = VXElements.byId(
            "savePrivacyPreferences"
        );

        const blockedButton = VXElements.byId(
            "manageBlockedAccounts"
        );

        const restrictedButton = VXElements.byId(
            "manageRestrictedAccounts"
        );


        if (saveButton) {

            saveButton.addEventListener(
                "click",
                () => this.savePrivacyPreferences()
            );

        }


        if (blockedButton) {

            blockedButton.addEventListener(
                "click",
                () => this.manageBlockedAccounts()
            );

        }


        if (restrictedButton) {

            restrictedButton.addEventListener(
                "click",
                () => this.manageRestrictedAccounts()
            );

        }

    }

};


/* -----------------------------------------
   INITIALIZE PRIVACY SYSTEM
----------------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        VXPrivacy.initialize();

    }
);


/* =====================================================
   VANTAGE X COMMUNITY
   JAVASCRIPT SECTION 7
   SECURITY & LOGIN MANAGEMENT
===================================================== */


/* =========================================
   1. SECURITY MANAGEMENT CONFIGURATION
========================================= */

const VXSecurity = {

  initialized: false,

  user: null,

  client: null,

  preferencesKey: "vx_security_preferences",

  defaultPreferences: {
    newLoginAlerts: true,
    unusualActivityAlerts: true,
    passwordChangeAlerts: true
  },


  /* =========================================
     2. INITIALIZE SECURITY CENTRE
  ========================================= */

  async initialize() {

    if (this.initialized) return;

    this.client = VXDatabase.getClient();

    if (!this.client) {
      VXUtils.error("Security system cannot connect to Supabase.");
      return;
    }

    this.initialized = true;

    await this.loadAuthenticatedUser();

    if (!this.user) {

      this.setOverview(
        "Sign-in required",
        "Sign in to manage your account security."
      );

      return;

    }

    await this.loadTwoFactorStatus();

    this.loadSecurityPreferences();

    await this.refreshLoginActivity();

    this.attachEvents();

    VXUtils.log("Security management initialized.");

  },


  /* =========================================
     3. GET AUTHENTICATED USER
  ========================================= */

  async loadAuthenticatedUser() {

    try {

      const {
        data,
        error
      } = await this.client.auth.getUser();

      if (error) throw error;

      this.user = data.user || null;

      return this.user;

    } catch (error) {

      VXUtils.error(
        "Unable to retrieve authenticated user.",
        error
      );

      this.user = null;

      return null;

    }

  },


  /* =========================================
     4. SECURITY OVERVIEW
  ========================================= */

  setOverview(title, description) {

    VXUtils.setText(
      "securityOverallStatus",
      title
    );

    VXUtils.setText(
      "securityOverallDescription",
      description
    );

  },


  updateOverview() {

    const twoFactor =
      VXElements.byId("securityTwoFactorEnabled");

    if (twoFactor && twoFactor.checked) {

      this.setOverview(
        "Additional authentication enabled",
        "Two-factor authentication is configured for your account."
      );

    } else {

      this.setOverview(
        "Basic account protection",
        "Your account uses its existing authentication method. Consider enabling additional protection."
      );

    }

  },


  /* =========================================
     5. PASSWORD MANAGEMENT
  ========================================= */

  async changePassword() {

    if (!this.user) {

      alert("Please sign in before changing your password.");

      return;

    }

    const newPassword = prompt(
      "Enter your new password.\n\nUse at least 8 characters."
    );

    if (newPassword === null) return;

    if (newPassword.length < 8) {

      alert("Your password must contain at least 8 characters.");

      return;

    }

    const confirmation = prompt(
      "Enter your new password again to confirm."
    );

    if (confirmation === null) return;

    if (newPassword !== confirmation) {

      alert("The passwords do not match.");

      return;

    }

    try {

      VXStatus.show(
        "securitySettingsStatus",
        "Updating your password...",
        "info"
      );

      const {
        data,
        error
      } = await this.client.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      VXStatus.show(
        "securitySettingsStatus",
        "Your password was updated successfully.",
        "success"
      );

      VXUtils.log("Account password updated.");

    } catch (error) {

      VXUtils.error(
        "Password update failed.",
        error
      );

      VXStatus.show(
        "securitySettingsStatus",
        error.message || "Unable to update your password.",
        "error"
      );

    }

  },


  /* =========================================
     6. TWO-FACTOR AUTHENTICATION STATUS
  ========================================= */

  async loadTwoFactorStatus() {

    const toggle = VXElements.byId(
      "securityTwoFactorEnabled"
    );

    const status = VXElements.byId(
      "twoFactorStatus"
    );

    try {

      const {
        data,
        error
      } = await this.client.auth.mfa.listFactors();

      if (error) throw error;

      const verifiedFactors =
        data.totp.filter(
          factor => factor.status === "verified"
        );

      const enabled = verifiedFactors.length > 0;

      if (toggle) {
        toggle.checked = enabled;
      }

      if (status) {

        status.textContent = enabled
          ? "Enabled"
          : "Not configured";

      }

      this.updateOverview();

      return enabled;

    } catch (error) {

      VXUtils.error(
        "Unable to check two-factor authentication.",
        error
      );

      if (status) {
        status.textContent = "Status unavailable";
      }

      return false;

    }

  },


  /* =========================================
     7. ENABLE TWO-FACTOR AUTHENTICATION
  ========================================= */

  async enableTwoFactor() {

    if (!this.user) {

      alert("Please sign in first.");

      return false;

    }

    let factorId = null;

    try {

      VXStatus.show(
        "securitySettingsStatus",
        "Preparing two-factor authentication...",
        "info"
      );

      const {
        data,
        error
      } = await this.client.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "VANTAGE X Authenticator"
      });

      if (error) throw error;

      factorId = data.id;

      const secret = data.totp.secret;

      const qrCode = data.totp.qr_code;

      alert(
        "Your authenticator setup has started.\n\n" +
        "Add this secret to a compatible authenticator app:\n\n" +
        secret +
        "\n\nKeep this secret private. Do not share it with anyone."
      );

      const verificationCode = prompt(
        "Enter the verification code generated by your authenticator app."
      );

      if (!verificationCode) {

        await this.client.auth.mfa.unenroll({
          factorId
        });

        throw new Error(
          "Two-factor setup was cancelled."
        );

      }

      const {
        data: challengeData,
        error: challengeError
      } = await this.client.auth.mfa.challenge({
        factorId
      });

      if (challengeError) throw challengeError;

      const {
        error: verifyError
      } = await this.client.auth.mfa.verify({

        factorId,

        challengeId: challengeData.id,

        code: verificationCode.trim()

      });

      if (verifyError) throw verifyError;

      await this.loadTwoFactorStatus();

      VXStatus.show(
        "securitySettingsStatus",
        "Two-factor authentication is now enabled.",
        "success"
      );

      return true;

    } catch (error) {

      if (factorId) {

        try {

          await this.client.auth.mfa.unenroll({
            factorId
          });

        } catch (cleanupError) {

          VXUtils.error(
            "Could not clean up incomplete MFA setup.",
            cleanupError
          );

        }

      }

      VXUtils.error(
        "Two-factor setup failed.",
        error
      );

      VXStatus.show(
        "securitySettingsStatus",
        error.message || "Unable to enable two-factor authentication.",
        "error"
      );

      await this.loadTwoFactorStatus();

      return false;

    }

  },


  /* =========================================
     8. DISABLE TWO-FACTOR AUTHENTICATION
  ========================================= */

  async disableTwoFactor() {

    const confirmed = confirm(
      "Are you sure you want to disable two-factor authentication?\n\nThis will reduce your account protection."
    );

    if (!confirmed) {

      await this.loadTwoFactorStatus();

      return;

    }

    try {

      const {
        data,
        error
      } = await this.client.auth.mfa.listFactors();

      if (error) throw error;

      const verifiedFactors =
        data.totp.filter(
          factor => factor.status === "verified"
        );

      for (const factor of verifiedFactors) {

        const {
          error: unenrollError
        } = await this.client.auth.mfa.unenroll({
          factorId: factor.id
        });

        if (unenrollError) throw unenrollError;

      }

      await this.loadTwoFactorStatus();

      VXStatus.show(
        "securitySettingsStatus",
        "Two-factor authentication has been disabled.",
        "success"
      );

    } catch (error) {

      VXUtils.error(
        "Unable to disable two-factor authentication.",
        error
      );

      VXStatus.show(
        "securitySettingsStatus",
        error.message || "Unable to disable two-factor authentication.",
        "error"
      );

      await this.loadTwoFactorStatus();

    }

  },


  /* =========================================
     9. RECOVERY INFORMATION
  ========================================= */

  manageRecoveryOptions() {

    if (!this.user) {

      alert("Please sign in first.");

      return;

    }

    const email =
      this.user.email || "No email available";

    alert(
      "ACCOUNT RECOVERY INFORMATION\n\n" +
      "Account email: " + email +
      "\n\n" +
      "You can use your registered email to access the password recovery process.\n\n" +
      "Additional recovery methods will be added when the recovery management system is implemented."
    );

  },


  /* =========================================
     10. LOGIN ACTIVITY
  ========================================= */

  async refreshLoginActivity() {

    const container = VXElements.byId(
      "securityLoginActivity"
    );

    if (!container) return;

    if (!this.user) {

      container.textContent =
        "Sign in to view available account information.";

      return;

    }

    try {

      const {
        data,
        error
      } = await this.client.auth.getSession();

      if (error) throw error;

      const session = data.session;

      if (!session) {

        container.textContent =
          "No active session was found.";

        return;

      }

      const lastSignIn =
        this.user.last_sign_in_at
          ? new Date(
              this.user.last_sign_in_at
            ).toLocaleString()
          : "Not available";

      const device =
        navigator.userAgent || "Unknown device";

      container.replaceChildren();

      const activityCard =
        document.createElement("div");

      activityCard.className =
        "settings-security-activity-item";

      const heading =
        document.createElement("strong");

      heading.textContent =
        "Current signed-in session";

      const details =
        document.createElement("p");

      details.textContent =
        "Last sign-in recorded: " +
        lastSignIn;

      const deviceInfo =
        document.createElement("p");

      deviceInfo.textContent =
        "Current browser/device: " + device;

      const note =
        document.createElement("p");

      note.textContent =
        "This is information about your current session, not a complete login history.";

      activityCard.append(
        heading,
        details,
        deviceInfo,
        note
      );

      container.appendChild(activityCard);

    } catch (error) {

      VXUtils.error(
        "Unable to refresh login information.",
        error
      );

      container.textContent =
        "Unable to retrieve current session information.";

    }

  },


  /* =========================================
     11. ACTIVE SESSION MANAGEMENT
  ========================================= */

  async signOutOtherSessions() {

    if (!this.user) {

      alert("Please sign in first.");

      return;

    }

    const confirmed = confirm(
      "Sign out other sessions connected to your account?\n\nYour current session should remain active."
    );

    if (!confirmed) return;

    try {

      VXStatus.show(
        "securitySettingsStatus",
        "Signing out other sessions...",
        "info"
      );

      const {
        error
      } = await this.client.auth.signOut({
        scope: "others"
      });

      if (error) throw error;

      VXStatus.show(
        "securitySettingsStatus",
        "The request to sign out other sessions was completed.",
        "success"
      );

      await this.refreshLoginActivity();

    } catch (error) {

      VXUtils.error(
        "Unable to sign out other sessions.",
        error
      );

      VXStatus.show(
        "securitySettingsStatus",
        error.message || "Unable to sign out other sessions.",
        "error"
      );

    }

  },


  /* =========================================
     12. SECURITY PREFERENCES
  ========================================= */

  getPreferences() {

    try {

      const stored = localStorage.getItem(
        this.preferencesKey
      );

      if (!stored) {
        return { ...this.defaultPreferences };
      }

      return {
        ...this.defaultPreferences,
        ...JSON.parse(stored)
      };

    } catch (error) {

      VXUtils.error(
        "Unable to read local security preferences.",
        error
      );

      return { ...this.defaultPreferences };

    }

  },


  loadSecurityPreferences() {

    const preferences = this.getPreferences();

    VXUtils.setValue(
      "securityNewLoginAlerts",
      preferences.newLoginAlerts
    );

    VXUtils.setValue(
      "securityUnusualActivityAlerts",
      preferences.unusualActivityAlerts
    );

    VXUtils.setValue(
      "securityPasswordChangeAlerts",
      preferences.passwordChangeAlerts
    );

  },


  saveSecurityPreferences() {

    const preferences = {

      newLoginAlerts:
        VXUtils.getValue("securityNewLoginAlerts"),

      unusualActivityAlerts:
        VXUtils.getValue("securityUnusualActivityAlerts"),

      passwordChangeAlerts:
        VXUtils.getValue("securityPasswordChangeAlerts")

    };

    try {

      localStorage.setItem(
        this.preferencesKey,
        JSON.stringify(preferences)
      );

      VXStatus.show(
        "securitySettingsStatus",
        "Preferences saved on this device. They are not yet synchronised across devices or connected to notification delivery.",
        "success"
      );

      VXUtils.log(
        "Local security preferences saved.",
        preferences
      );

    } catch (error) {

      VXUtils.error(
        "Unable to save security preferences.",
        error
      );

      VXStatus.show(
        "securitySettingsStatus",
        "Unable to save preferences on this device.",
        "error"
      );

    }

  },


  /* =========================================
     13. CONNECT SECURITY BUTTONS
  ========================================= */

  attachEvents() {

    const passwordButton =
      VXElements.byId("changePasswordButton");

    const recoveryButton =
      VXElements.byId("manageRecoveryOptions");

    const twoFactorToggle =
      VXElements.byId("securityTwoFactorEnabled");

    const refreshButton =
      VXElements.byId("refreshLoginActivity");

    const logoutButton =
      VXElements.byId("logoutOtherSessions");

    const saveButton =
      VXElements.byId("saveSecurityPreferences");


    if (passwordButton) {

      passwordButton.addEventListener(
        "click",
        () => this.changePassword()
      );

    }


    if (recoveryButton) {

      recoveryButton.addEventListener(
        "click",
        () => this.manageRecoveryOptions()
      );

    }


    if (twoFactorToggle) {

      twoFactorToggle.addEventListener(
        "change",
        async () => {

          if (twoFactorToggle.checked) {

            await this.enableTwoFactor();

          } else {

            await this.disableTwoFactor();

          }

        }
      );

    }


    if (refreshButton) {

      refreshButton.addEventListener(
        "click",
        () => this.refreshLoginActivity()
      );

    }


    if (logoutButton) {

      logoutButton.addEventListener(
        "click",
        () => this.signOutOtherSessions()
      );

    }


    if (saveButton) {

      saveButton.addEventListener(
        "click",
        () => this.saveSecurityPreferences()
      );

    }

  }

};


/* =========================================
   14. INITIALIZE SECURITY MANAGEMENT
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    VXSecurity.initialize();

  }
);


/* =====================================================
   END OF JAVASCRIPT SECTION 7
===================================================== */





          


