(function (window) {
    if (!window) throw "Missing dependency for smartbanner.js";
    window.SmartBanner = {
        init: function (config) {
            const COOKIE_SMART_BANNER_TEST = "sbt";
            const COOKIE_SMART_BANNER_DISMISS = "sbad";
            const COOKIE_EXPIRATION_DAYS = config.cookieExpirationDays;
            const ANDROID_STORE_URL = config.androidStoreUrl;
            const ANDROID_DEEP_LINK = config.androidDeepLink;
            const IOS_APP_STORE_URL = config.iosAppStoreUrl;
            const IOS_DEEP_LINK = config.iosDeepLink;
            const OPEN_APP_TIMEOUT = 2000;
            const DOWNLOAD_COPY = "Descargar";
            const isApple = true
            const isAndroid = false

            function createSmartBannerCookie() {
                /*window._SetCookie(
                    COOKIE_SMART_BANNER_DISMISS,
                    'true',
                    COOKIE_EXPIRATION_DAYS
                );*/
            }
            function setupCloseButton() {
                const closeBtn = document.getElementById('smart-banner-close-btn');
                if (!closeBtn) return;

                closeBtn.onclick = function (e) {
                    e.preventDefault();
                    createSmartBannerCookie();
                    showHideSmartBanner(false);
                };
            }
            function setupDownloadLink(linkElement, textElement, url) {
                textElement.textContent = DOWNLOAD_COPY;
                linkElement.setAttribute('href', url);
                linkElement.setAttribute('target', "_blank");
                linkElement.setAttribute('rel', "noopener noreferrer");
                linkElement.onclick = function (e) {
                    createSmartBannerCookie();
                };
            }
            function showHideSmartBanner(show) {
                const smartBanner = document.getElementById('smartBannerApp');
                if (!smartBanner) return;

                if (show) {
                    smartBanner.classList.remove('hidden');
                } else {
                    smartBanner.classList.add('hidden');
                }
            }
            function handleAndroid() {
                const smartBannerLink = document.getElementById('smartBannerLink');
                const textElement = smartBannerLink.querySelector('span');

                try {
                    smartBannerLink.setAttribute('href', ANDROID_DEEP_LINK);
                    smartBannerLink.onclick = async function (e) {
                        e.preventDefault();
                        createSmartBannerCookie();
                        const androidInstalled = false
                        if (androidInstalled)
                            window.location.href = ANDROID_DEEP_LINK;
                        else
                            openLink(ANDROID_DEEP_LINK, ANDROID_STORE_URL);
                    };
                } catch (error) {
                    setupDownloadLink(smartBannerLink, textElement, ANDROID_STORE_URL);
                }
            }

            function handleIOS() {
                const smartBannerLink = document.getElementById('smartBannerLink');

                smartBannerLink.onclick = function (e) {
                    e.preventDefault();
                    createSmartBannerCookie();
                    openLink(IOS_DEEP_LINK, IOS_APP_STORE_URL);
                };
            }
            
            function openLink(deepLink, storeLink) {
                let isOpened = false;
                let iframe = null;
                function detectAppOpen() {
                    if (document.hidden || document.webkitHidden) {
                        isOpened = true;
                    }
                }

                document.addEventListener('visibilitychange', detectAppOpen);
                document.addEventListener('webkitvisibilitychange', detectAppOpen);

                iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.style.width = '0';
                iframe.style.height = '0';
                iframe.style.border = 'none';
                iframe.style.visibility = 'hidden';

                document.body.appendChild(iframe);
                iframe.src = deepLink;

                setTimeout(function () {
                    document.removeEventListener('visibilitychange', detectAppOpen);
                    document.removeEventListener('webkitvisibilitychange', detectAppOpen);

                    if (iframe && iframe.parentNode) {
                        document.body.removeChild(iframe);
                    }

                    if (!isOpened && storeLink) {
                        window.location.href = storeLink;
                    }
                }, OPEN_APP_TIMEOUT);
            }

            function initSmartBanner() {

                if (!isApple && !isAndroid) return;

                const smartBanner = document.getElementById('smartBannerApp');
                if (!smartBanner) return;

                showHideSmartBanner(true);
                setupCloseButton();

                if (isAndroid) {
                    handleAndroid();
                } else if (isApple) {
                    handleIOS();
                } else {
                    showHideSmartBanner(false);
                }
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initSmartBanner);
            } else {
                initSmartBanner();
            }
        }
    };
})(window);

