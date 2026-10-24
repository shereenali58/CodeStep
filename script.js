/* =====================================
   1. زر إنجاز المهمة + حفظ الإنجاز
   ===================================== */

const completeTasks = document.querySelectorAll(".complete-task");

completeTasks.forEach(function(task, index) {
    const button = task.querySelector("button");
    const lessonKey = "CodeStep_lesson_" + index;

    if (!button) {
        return;
    }

    // استرجاع حالة الدرس المحفوظة
    if (localStorage.getItem(lessonKey) === "completed") {
        button.textContent = "أكملت الدرس 🎉";
        button.disabled = true;
    }

    // حفظ الإنجاز عند الضغط
    button.addEventListener("click", function() {
        localStorage.setItem(lessonKey, "completed");

        button.textContent = "أكملت الدرس 🎉";
        button.disabled = true;
    });
});


/* =====================================
   2. الاختيار من متعدد
   ===================================== */

const allOptions = document.querySelectorAll(".option");

allOptions.forEach(function(option) {
    option.addEventListener("click", function(event) {
        event.preventDefault();

        // تحديد حاوية السؤال حسب الكلاس الموجود
        const question =
            option.closest(".quiz-card") ||
            option.closest(".lesson-card");

        if (!question) {
            return;
        }

        // منع إعادة الإجابة بعد الاختيار
        if (question.dataset.answered === "true") {
            return;
        }

        const options = question.querySelectorAll(".option");

        if (option.dataset.answer === "correct") {
            // الإجابة الصحيحة
            option.style.backgroundColor = "green";
            option.style.color = "red";
        } else {
            // الإجابة الخاطئة
            option.style.backgroundColor = "red";
            option.style.color = "green";

            // إظهار الإجابة الصحيحة باللون الأخضر
            options.forEach(function(item) {
                if (item.dataset.answer === "correct") {
                    item.style.backgroundColor = "green";
                    item.style.color = "red";
                }
            });
        }

        question.dataset.answered = "true";
    });
});


/* =====================================
   3. القائمة الجانبية
   ===================================== */

function toggleSidebar() {
    const sidebar = document.getElementById("mySidebar");

    if (sidebar) {
        sidebar.classList.toggle("active");
    }
}


/* =====================================
   4. إعداد الشهادة
   ===================================== */

const certificateArea =
    document.querySelector("#certificateArea");

const createCertificateButton =
    document.querySelector("#createCertificate");

const printCertificateButton =
    document.querySelector("#printCertificate");

const certificateStatus =
    document.querySelector("#certificateStatus");

const certificateLessonButtons =
    document.querySelectorAll(".complete-task");


/* =====================================
   5. فحص إنجاز الدروس
   ===================================== */

function updateCertificateAvailability() {
    const totalLessons = certificateLessonButtons.length;
    let completedLessons = 0;

    // إبقاء علامة الشهادة ظاهرة في الواجهة
    if (certificateArea) {
        certificateArea.hidden = false;
    }

    // حساب الدروس المكتملة
    certificateLessonButtons.forEach(function(task, index) {
        const lessonKey = "CodeStep_lesson_" + index;

        if (localStorage.getItem(lessonKey) === "completed") {
            completedLessons++;
        }
    });

    // إذا لم توجد دروس قابلة للحساب
    if (totalLessons === 0) {
        if (certificateStatus) {
            certificateStatus.textContent =
                "أكمل الدروس حتى تتمكن من إصدار شهادتك.";
        }

        if (createCertificateButton) {
            createCertificateButton.disabled = true;
        }

        return;
    }

    // إذا اكتملت جميع الدروس
    if (completedLessons === totalLessons) {
        if (certificateStatus) {
            certificateStatus.textContent =
                "أحسنت! أكملت جميع الدروس، يمكنك الآن إصدار شهادتك 🎉";
        }

        if (createCertificateButton) {
            createCertificateButton.disabled = false;
        }
    } else {
        // إذا بقيت دروس غير مكتملة
        if (certificateStatus) {
            certificateStatus.textContent =
                "أكمل جميع الدروس حتى تتمكن من إصدار شهادتك. " +
                "الدروس المكتملة: " + completedLessons +
                " من " + totalLessons;
        }

        if (createCertificateButton) {
            createCertificateButton.disabled = true;
        }
    }
}


/* =====================================
   6. تحديث حالة الشهادة
   ===================================== */

// الفحص عند فتح الصفحة
updateCertificateAvailability();

// إعادة الفحص بعد الضغط على إنجاز المهمة
certificateLessonButtons.forEach(function(task) {
    const button = task.querySelector("button");

    if (button) {
        button.addEventListener("click", function() {
            updateCertificateAvailability();
        });
    }
});


/* =====================================
   7. إنشاء الشهادة
   ===================================== */

if (createCertificateButton) {
    createCertificateButton.addEventListener("click", function() {
        // فحص الإنجاز مرة أخرى قبل إصدار الشهادة
        updateCertificateAvailability();

        if (createCertificateButton.disabled) {
            alert("أكمل جميع الدروس أولًا حتى تصدر الشهادة.");
            return;
        }

        const studentNameInput =
            document.querySelector("#studentName");

        if (!studentNameInput) {
            return;
        }

        const studentName = studentNameInput.value.trim();

        if (studentName === "") {
            alert("يرجى كتابة اسم الطالب/الطالبة أولًا.");
            return;
        }

        const certificateStudent =
            document.querySelector("#certificateStudent");

        const certificateDate =
            document.querySelector("#certificateDate");

        const certificate =
            document.querySelector("#certificate");

        if (!certificateStudent || !certificateDate || !certificate) {
            return;
        }

        // نقل الاسم إلى الشهادة
        certificateStudent.textContent = studentName;

        // إضافة تاريخ إصدار الشهادة
        certificateDate.textContent =
            new Date().toLocaleDateString("en-GB");

        // إظهار الشهادة
        certificate.hidden = false;

        // الانتقال إلى الشهادة
        certificate.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}


/* =====================================
   8. طباعة الشهادة أو حفظها PDF
   ===================================== */

if (printCertificateButton) {
    printCertificateButton.addEventListener("click", function() {
        window.print();
    });
}