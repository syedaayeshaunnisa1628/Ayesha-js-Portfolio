// GLOBAL VARIABLES 
let autoSlideInterval, trafficInterval, countdownInterval, trafficTimeInterval;
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentSlide = 0, autoSlide = false, timeLeft = 60, captchaValue = '';
let shouldResetDisplay = false, trafficRunning = false, cycleCount = 0;
let trafficUptime = 0, currentFilter = 'all';

// MOBILE NAVIGATION 
function toggleMobileMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}

// Close mobile menu when clicking a link
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('navLinks').classList.remove('active');
        });
    });
});

// NAVIGATION 
function showPage(pageId) {
    document.querySelectorAll('.project').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    event.currentTarget.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

//PROJECT 1: DYNAMIC TEXT
function createParagraph() {
    const container = document.getElementById('textContainer');
    const p = document.createElement('p');
    const messages = [
        'JavaScript transforms static pages into dynamic experiences!',
        'Every line of code brings your ideas to life.',
        'DOM manipulation is the magic behind interactivity.',
        'Keep building, keep innovating, keep coding!',
        'Modern web development starts with vanilla JS.',
        'Interactive UIs create memorable user experiences.',
        'Clean code is not written by following rules. It’s written by developers who care.'
    ];
    const colors = [
        'linear-gradient(135deg, #8b5cf6, #f472b6)',
        'linear-gradient(135deg, #06b6d4, #3b82f6)',
        'linear-gradient(135deg, #10b981, #059669)',
        'linear-gradient(135deg, #f59e0b, #d97706)',
        'linear-gradient(135deg, #ec4899, #8b5cf6)'
    ];
    p.innerHTML = `<i class="fas fa-sparkles"></i> ${messages[Math.floor(Math.random() * messages.length)]} <br><small><i class="fas fa-clock"></i> ${new Date().toLocaleTimeString()}</small>`;
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    container.appendChild(p);
}

function clearParagraphs() {
    document.getElementById('textContainer').innerHTML = '';
}

// PROJECT 2: PASTEL COLOR CHANGER
function changeBackground() {
    const color = document.getElementById('colorPicker').value;
    // Force pastel by blending with white - no harsh colors
    document.body.style.background = `linear-gradient(135deg, ${color} 0%, ${lightenColor(color, 50)} 100%)`;
}

function setPreset(color) {
    document.getElementById('colorPicker').value = color;
    changeBackground();
}

function lightenColor(hex, percent) {
    const num = parseInt(hex.replace("#",""), 16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) + amt,
          G = (num >> 8 & 0x00FF) + amt,
          B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}

// PROJECT 3: DIGITAL CLOCK 
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
    const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    document.getElementById('clock').innerHTML = timeString;
    document.getElementById('clockDate').textContent = dateString;
}
setInterval(updateClock, 1000);

//PROJECT 4: CALCULATOR 
function calcInput(value) {
    const display = document.getElementById('calcDisplay');
    if (value === 'C') {
        display.value = '';
        shouldResetDisplay = false;
    } else if (value === '⌫') {
        display.value = display.value.slice(0, -1);
    } else if (value === '=') {
        try {
            let expr = display.value.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
            // Prevent division by zero
            if (expr.includes('/0')) throw new Error('Division by zero');
            display.value = eval(expr).toString();
            shouldResetDisplay = true;
        } catch {
            display.value = 'Error';
            setTimeout(() => display.value = '', 1500);
        }
    } else {
        if (shouldResetDisplay &&!isNaN(value)) {
            display.value = '';
            shouldResetDisplay = false;
        }
        display.value += value;
    }
}

// PROJECT 5:IMAGE SLIDER, CAROUSAL
function showSlide(index) {
    document.querySelectorAll('.slide').forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
}

function nextSlide() { showSlide((currentSlide + 1) % 4); }
function prevSlide() { showSlide((currentSlide + 3) % 4); }
function goToSlide(index) { showSlide(index); }

function toggleAutoSlide() {
    autoSlide =!autoSlide;
    const btn = document.getElementById('autoBtn');
    btn.innerHTML = autoSlide? '<i class="fas fa-pause"></i> Auto: On' : '<i class="fas fa-play"></i> Auto';
    if (autoSlide) {
        autoSlideInterval = setInterval(nextSlide, 3000);
    } else {
        clearInterval(autoSlideInterval);
    }
}

// Touch swipe for mobile
let touchStartX = 0;
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    if (slider) {
        slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
        slider.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) nextSlide();
            if (touchEndX - touchStartX > 50) prevSlide();
        });
    }
});

// PROJECT 6: API DATA FETCH 
async function fetchUsers() {
    const list = document.getElementById('userList');
    list.innerHTML = '<li style="text-align:center;padding:30px;"><i class="fas fa-spinner fa-spin fa-2x"></i><br>Loading users...</li>';
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await response.json();
        list.innerHTML = '';
        users.slice(0, 6).forEach(user => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong><i class="fas fa-user"></i> ${user.name}</strong><br>
                <small><i class="fas fa-envelope"></i> ${user.email}</small><br>
                <small><i class="fas fa-map-marker-alt"></i> ${user.address.city}</small><br>
                <small><i class="fas fa-phone"></i> ${user.phone.split(' ')[0]}</small><br>
                <small><i class="fas fa-globe"></i> ${user.website}</small>
            `;
            list.appendChild(li);
        });
    } catch (error) {
        list.innerHTML = '<li style="text-align:center;padding:30px;"><i class="fas fa-exclamation-triangle fa-2x"></i><br>Error fetching data. Check connection.</li>';
    }
}

function clearUsers() {
    document.getElementById('userList').innerHTML = '';
}

// PROJECT 7: TIMER APP
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timerDisplay').textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const totalTime = parseInt(document.getElementById('timerMinutes').value) * 60;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

function setTimer(minutes) {
    document.getElementById('timerMinutes').value = minutes;
    timeLeft = minutes * 60;
    updateTimerDisplay();
}

function startCountdown() {
    if (timeLeft <= 0) timeLeft = parseInt(document.getElementById('timerMinutes').value) * 60;

    document.getElementById('startTimer').disabled = true;
    document.getElementById('stopTimer').disabled = false;
    document.getElementById('timerMinutes').disabled = true;

    countdownInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('timerDisplay').style.color = '#ef4444';
            // Play notification sound if available
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Timer Complete!', { body: 'Great job staying focused!' });
            }
            alert('⏰ Time is up! Take a break.');
            resetTimer();
            return;
        }
        timeLeft--;
        updateTimerDisplay();
    }, 1000);
}

function stopCountdown() {
    clearInterval(countdownInterval);
    document.getElementById('startTimer').disabled = false;
    document.getElementById('stopTimer').disabled = true;
    document.getElementById('timerMinutes').disabled = false;
}

function resetTimer() {
    stopCountdown();
    timeLeft = parseInt(document.getElementById('timerMinutes').value) * 60;
    updateTimerDisplay();
    document.getElementById('timerDisplay').style.color = 'var(--primary)';
    document.getElementById('progressBar').style.width = '0%';
}

// PROJECT 8:TRAFFIC SIGNAL STIMULATOR
function updateTrafficTime() {
    if (trafficRunning) {
        trafficUptime++;
        const mins = Math.floor(trafficUptime / 60);
        const secs = trafficUptime % 60;
        document.getElementById('trafficTime').textContent =
            `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

function startTrafficCycle() {
    if (trafficRunning) return;
    trafficRunning = true;
    cycleCount = 0;
    trafficUptime = 0;
    document.getElementById('trafficStatus').textContent = 'System Active';
    document.getElementById('statusIcon').style.color = '#86efac';

    trafficTimeInterval = setInterval(updateTrafficTime, 1000);

    let phase = 0; //0=North, 1=East, 2=South
    const runCycle = () => {
        ['north','east','south'].forEach(dir => {
            ['Red', 'Yellow', 'Green'].forEach(color => {
                document.getElementById(dir + color).classList.remove('active');
                document.getElementById(dir + 'Count').textContent = '--';
            });
        });

        const directions = ['north', 'east', 'south'];
        const activeDir = directions[phase];
        const redDirs = directions.filter(d => d!== activeDir);

        redDirs.forEach(dir => {
            document.getElementById(dir + 'Red').classList.add('active');
        });

        document.getElementById(activeDir + 'Green').classList.add('active');
        let countdown = 5;
        const greenTimer = setInterval(() => {
            document.getElementById(activeDir + 'Count').textContent = countdown;
            countdown--;
            if (countdown < 0) {
                clearInterval(greenTimer);
                document.getElementById(activeDir + 'Green').classList.remove('active');

                document.getElementById(activeDir + 'Yellow').classList.add('active');
                let yellowCount = 2;
                const yellowTimer = setInterval(() => {
                    document.getElementById(activeDir + 'Count').textContent = yellowCount;
                    yellowCount--;
                    if (yellowCount < 0) {
                        clearInterval(yellowTimer);
                        phase = (phase + 1) % 3;
                        if (phase === 0) cycleCount++;
                        document.getElementById('cycleCount').textContent = cycleCount;
                        if (trafficRunning) setTimeout(runCycle, 100);
                    }
                }, 1000);
            }
        }, 1000);
    };
    runCycle();
}

function stopTrafficCycle() {
    trafficRunning = false;
    clearInterval(trafficTimeInterval);
    ['north', 'east', 'south'].forEach(dir => {
        ['Red', 'Yellow', 'Green'].forEach(color => {
            document.getElementById(dir + color).classList.remove('active');
            document.getElementById(dir + 'Count').textContent = '--';
        });
    });
    document.getElementById('trafficStatus').textContent = 'System Offline';
    document.getElementById('statusIcon').style.color = '#fca5a5';
}

// PROJECT 9: REGISTRATION
// function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    captchaValue = '';
    for (let i = 0; i < 6; i++) {
        captchaValue += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('captchaCode').textContent = captchaValue;
    validateForm();


function togglePassword(id) {
    const input = document.getElementById(id);
    const icon = input.nextElementSibling;
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function validateForm() {
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const captchaInput = document.getElementById('captchaInput').value.toUpperCase();

    ['emailError', 'phoneError', 'passwordError', 'confirmError', 'captchaError'].forEach(id => {
        document.getElementById(id).textContent = '';
    });

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phoneValid = /^\d{10}$/.test(phone);
    const passwordValid = password.length >= 6;
    const passwordsMatch = password === confirmPassword && password!== '';
    const captchaValid = captchaInput === captchaValue && captchaValue!== '';

    if (email &&!emailValid) document.getElementById('emailError').textContent = 'Invalid email format';
    if (phone &&!phoneValid) document.getElementById('phoneError').textContent = 'Phone must be 10 digits';
    if (password &&!passwordValid) document.getElementById('passwordError').textContent = 'Password must be 6+ characters';
    if (confirmPassword &&!passwordsMatch) document.getElementById('confirmError').textContent = 'Passwords do not match';
    if (captchaInput &&!captchaValid) document.getElementById('captchaError').textContent = 'Captcha incorrect';

    const isValid = emailValid && phoneValid && passwordValid && passwordsMatch && captchaValid;
    document.getElementById('submitBtn').disabled =!isValid;
}

// PROJECT 10: ADVANCED TODO
function renderTodos() {
    const list = document.getElementById('todoList');
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return!todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });

    list.innerHTML = '';
    if (filteredTodos.length === 0) {
        list.innerHTML = '<li style="text-align:center; padding:40px; opacity:0.5;"><i class="fas fa-inbox fa-2x"></i><br>No tasks found</li>';
    }

    filteredTodos.forEach((todo, index) => {
        const realIndex = todos.indexOf(todo);
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" ${todo.completed? 'checked' : ''} onchange="toggleTodo(${realIndex})">
            <span class="todo-text" contenteditable="true" onblur="editTodo(${realIndex}, this.textContent)" onkeypress="if(event.key==='Enter') this.blur()">${todo.text}</span>
            <div class="todo-actions">
                <button onclick="deleteTodo(${realIndex})" title="Delete"><i class="fa fa-trash"></i></button>
            </div>
        `;
        list.appendChild(li);
    });

    updateTodoStats();
    localStorage.setItem('todos', JSON.stringify(todos));
}

function updateTodoStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
}

function addTodo() {
    const input = document.getElementById('todoInput');
    if (input.value.trim()) {
        todos.unshift({
            text: input.value.trim(),
            completed: false,
            id: Date.now(),
            created: new Date().toISOString()
        });
        input.value = '';
        renderTodos();
    }
}

function handleTodoKeypress(event) {
    if (event.key === 'Enter') addTodo();
}

function toggleTodo(index) {
    todos[index].completed =!todos[index].completed;
    renderTodos();
}

function editTodo(index, newText) {
    if (newText.trim()) {
        todos[index].text = newText.trim();
    } else {
        deleteTodo(index);
        return;
    }
    renderTodos();
}

function deleteTodo(index) {
    todos.splice(index, 1);
    renderTodos();
}

function clearCompleted() {
    todos = todos.filter(t =>!t.completed);
    renderTodos();
}

function filterTodos(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderTodos();
}

//INITIALIZE ON LOAD
document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
    updateTimerDisplay();
    generateCaptcha();
    updateClock();
    
    // Request notification permission for timer
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
})