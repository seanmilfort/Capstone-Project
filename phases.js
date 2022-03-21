//Javascript call to Pass Information for Phases Results
const p1btn = document.getElementById(".p1btn");
const p2btn = document.getElementById(".p2btn");
const p3btn = document.getElementById(".p3btn");
const p4btn = document.getElementById(".p4btn");

p1btn.addEventListener("click", function() {
    sessionStorage.setItem("selectedPhase", "phase1");
  });

p2btn.addEventListener("click", function() {
    sessionStorage.setItem("selectedPhase", "phase2");
});

p3btn.addEventListener("click", function() {
    sessionStorage.setItem("selectedPhase", "phase3");
});

p4btn.addEventListener("click", function() {
    sessionStorage.setItem("selectedPhase", "phase4");
});