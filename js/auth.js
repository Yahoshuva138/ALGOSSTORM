// ========================================================
// ALGOSSTORM — Authentication & Profile Management
// ========================================================

const AUTH_STORAGE_KEY = 'algosstorm_user_profile';
const GOOGLE_CLIENT_ID = '621394500243-3p8v9uju8n17gf5jumlldv34gkp93ssu.apps.googleusercontent.com';

let currentUser = null;

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      currentUser = JSON.parse(raw);
    }
  } catch (e) {
    currentUser = null;
  }
  updateAuthUI();
}

function saveUser(user) {
  currentUser = user;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {}
  updateAuthUI();
}

function updateAuthUI() {
  const signInBtn = document.getElementById('googleSignInBtn');
  const profileBadge = document.getElementById('userProfileBadge');
  const avatarImg = document.getElementById('userAvatarImg');
  const nameText = document.getElementById('userNameText');

  if (currentUser) {
    if (signInBtn) signInBtn.style.display = 'none';
    if (profileBadge) {
      profileBadge.style.display = 'inline-flex';
      if (avatarImg) {
        avatarImg.onerror = () => {
          avatarImg.src = 'assets/logo.svg';
        };
        avatarImg.src = currentUser.avatar || 'assets/logo.svg';
      }
      if (nameText) {
        nameText.textContent = currentUser.handle || currentUser.name || 'Coder';
      }
    }
  } else {
    if (signInBtn) signInBtn.style.display = 'inline-flex';
    if (profileBadge) profileBadge.style.display = 'none';
  }
}

function openAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.add('open');
    if (typeof soundClick === 'function') soundClick();
    initGoogleSignIn();
    const input = document.getElementById('cfHandleInput');
    if (input) setTimeout(() => input.focus(), 100);
  }
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.remove('open');
    if (typeof soundClick === 'function') soundClick();
  }
}

function handleProfileClick() {
  if (!currentUser) {
    openAuthModal();
    return;
  }

  // Calculate solved stats
  let solvedCount = 0;
  try {
    const solved = JSON.parse(localStorage.getItem('algosstorm_solved_days') || '[]');
    solvedCount = solved.length;
  } catch (e) {}

  const confirmSignOut = confirm(
    `Logged in as: ${currentUser.name || currentUser.handle} (${currentUser.handle || 'Google User'})\n` +
    `Email: ${currentUser.email || 'N/A'}\n` +
    `Quests Solved: ${solvedCount}/21\n\n` +
    `Would you like to sign out or switch accounts?`
  );

  if (confirmSignOut) {
    signOutUser();
  }
}

function loginWithHandle(handle) {
  const clean = (handle || '').trim();
  if (!clean) {
    alert('Please enter a valid Codeforces handle!');
    return;
  }

  const user = {
    handle: clean,
    name: clean,
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(clean)}&backgroundColor=0a0b12`,
    email: '',
    isGuest: true,
    joinedAt: new Date().toISOString()
  };

  saveUser(user);
  closeAuthModal();
  if (typeof soundSuccess === 'function') soundSuccess();
  if (typeof showToast === 'function') {
    showToast(`Welcome, ${clean}! ⚡ Codeforces profile linked.`);
  }
}

function signOutUser() {
  currentUser = null;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  updateAuthUI();
  if (typeof soundClick === 'function') soundClick();
  if (typeof showToast === 'function') {
    showToast('Signed out successfully.');
  }

  // Revoke Google session state if possible
  if (window.google && window.google.accounts && window.google.accounts.id) {
    try {
      window.google.accounts.id.disableAutoSelect();
    } catch (e) {}
  }
}

// Google Identity Services (GIS) Callback
window.handleCredentialResponse = function(response) {
  try {
    if (!response || !response.credential) {
      throw new Error('Missing credential in response');
    }

    // Decode JWT payload safely
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const data = JSON.parse(jsonPayload);

    const user = {
      name: data.name || data.given_name || 'Google User',
      email: data.email || '',
      avatar: data.picture || 'assets/logo.svg',
      handle: (data.given_name || data.name || 'User').split(' ')[0],
      isGuest: false,
      joinedAt: new Date().toISOString()
    };

    saveUser(user);
    closeAuthModal();
    if (typeof soundSuccess === 'function') soundSuccess();
    if (typeof showToast === 'function') {
      showToast(`Welcome back, ${user.name}! 🍂`);
    }
  } catch (e) {
    console.error('Google Sign-In Error:', e);
    if (typeof showToast === 'function') {
      showToast('Authentication failed. Please try again or use your Codeforces handle.');
    }
  }
};

// Programmatic Google Sign-In Initialization & Button Rendering
function initGoogleSignIn() {
  if (window.google && window.google.accounts && window.google.accounts.id) {
    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: window.handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      const wrapper = document.getElementById('googleSignInBtnWrapper');
      if (wrapper && !wrapper.querySelector('iframe')) {
        wrapper.innerHTML = '';
        window.google.accounts.id.renderButton(wrapper, {
          type: 'standard',
          theme: 'filled_black',
          size: 'large',
          shape: 'pill',
          text: 'signin_with',
          width: 280
        });
      }
    } catch (err) {
      console.debug('GIS initialization note:', err);
    }
  } else {
    // Retry if Google script is still asynchronously loading
    setTimeout(initGoogleSignIn, 400);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadStoredUser();
  initGoogleSignIn();

  // Attach event listeners
  const closeBtn = document.getElementById('closeAuthBtn');
  if (closeBtn) closeBtn.onclick = closeAuthModal;

  const authModal = document.getElementById('authModal');
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) closeAuthModal();
    });
  }

  const handleSubmitBtn = document.getElementById('saveHandleBtn');
  const handleInput = document.getElementById('cfHandleInput');
  if (handleSubmitBtn && handleInput) {
    handleSubmitBtn.onclick = () => loginWithHandle(handleInput.value);
    handleInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') loginWithHandle(handleInput.value);
    });
  }
});
