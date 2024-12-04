class Job {
    // constructor
    constructor({ title, postedTime, type, level, skill, detail }) {
        this.title = title || "N/A";
        this.postedTime = new Date(postedTime) || new Date();
        this.type = type || "N/A";
        this.level = level || "N/A";
        this.skill = skill || "N/A";
        this.detail = detail || "N/A";
    }

    // Universal getter
    getFormattedDetails() {
        return `
            <strong>Title:</strong> ${this.title}<br>
            <strong>Posted Time:</strong> ${this.postedTime.toDateString()}<br>
            <strong>Type:</strong> ${this.type}<br>
            <strong>Level:</strong> ${this.level}<br>
            <strong>Skill:</strong> ${this.skill}<br>
            <strong>Detail:</strong> ${this.detail}
        `;
    }

    // Sort by title
    static compareByTitle(a, b, order = "asc") {
        return order === "asc" 
            ? a.title.localeCompare(b.title) 
            : b.title.localeCompare(a.title);
    }

    // Sort by posted
    static compareByPostedTime(a, b, order = "oldest") {
        return order === "oldest" 
            ? a.postedTime - b.postedTime 
            : b.postedTime - a.postedTime;
    }
}

let jobs = [];
// Fillteres
document.getElementById("file-input").addEventListener("change", loadJobs);
document.getElementById("filter-level").addEventListener("change", filterAndRenderJobs);
document.getElementById("filter-type").addEventListener("change", filterAndRenderJobs);
document.getElementById("filter-skill").addEventListener("change", filterAndRenderJobs);
document.getElementById("sort-options").addEventListener("change", filterAndRenderJobs);

function loadJobs(event) {
    const file = event.target.files[0];
    const errorElement = document.getElementById("error");
    errorElement.textContent = "";

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                jobs = data.map((jobData) => new Job(jobData));
                populateFilters();
                renderJobs(jobs);
            } catch (error) {
                errorElement.textContent = "Error loading JSON: " + error.message;
            }
        };
        reader.readAsText(file);
    } else {
        errorElement.textContent = "Please select a valid JSON file.";
    }
}

function populateFilters() {
    const levels = new Set(jobs.map(job => job.level));
    const types = new Set(jobs.map(job => job.type));
    const skills = new Set(jobs.map(job => job.skill));

    populateSelect("filter-level", levels);
    populateSelect("filter-type", types);
    populateSelect("filter-skill", skills);
}

function populateSelect(id, items) {
    const select = document.getElementById(id);
    select.innerHTML = `<option value="">All</option>`;
    items.forEach(item => {
        select.innerHTML += `<option value="${item}">${item}</option>`;
    });
}

function filterAndRenderJobs() {
    let filteredJobs = [...jobs];

    const level = document.getElementById("filter-level").value;
    const type = document.getElementById("filter-type").value;
    const skill = document.getElementById("filter-skill").value;
    const sortOption = document.getElementById("sort-options").value;

    if (level) filteredJobs = filteredJobs.filter(job => job.level === level);
    if (type) filteredJobs = filteredJobs.filter(job => job.type === type);
    if (skill) filteredJobs = filteredJobs.filter(job => job.skill === skill);

    if (sortOption === "title-asc") {
        filteredJobs.sort((a, b) => Job.compareByTitle(a, b, "asc"));
    } else if (sortOption === "title-desc") {
        filteredJobs.sort((a, b) => Job.compareByTitle(a, b, "desc"));
    } else if (sortOption === "time-oldest") {
        filteredJobs.sort((a, b) => Job.compareByPostedTime(a, b, "oldest"));
    } else if (sortOption === "time-newest") {
        filteredJobs.sort((a, b) => Job.compareByPostedTime(a, b, "newest"));
    }

    renderJobs(filteredJobs);
}

function renderJobs(jobsToRender) {
    const jobList = document.getElementById("job-list");
    jobList.innerHTML = "";

    jobsToRender.forEach((job) => {
        const li = document.createElement("li");
        li.className = "job-item";
        li.textContent = `${job.title} - ${job.postedTime.toDateString()}`;
        li.addEventListener("click", () => showJobDetails(job));
        jobList.appendChild(li);
    });
}

function showJobDetails(job) {
    document.getElementById("job-details").innerHTML = job.getFormattedDetails();
}
