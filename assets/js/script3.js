document.getElementById('search-button').addEventListener('click', function() {
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    const resultsDiv = document.getElementById('results');
    const accountNameDiv = document.getElementById('account-name'); // المكان الجديد لعرض اسم الحساب
    const scheduleRows = document.querySelectorAll('#schedule-table tbody tr'); // جميع صفوف الجدول

    // Fetch data from the API
    fetch('https://66cb41954290b1c4f199e054.mockapi.io/study') // Ensure this is the correct API endpoint
        .then(response => response.json())
        .then(data => {
            resultsDiv.innerHTML = ''; // Clear previous results
            accountNameDiv.innerHTML = ''; // Clear previous account name
            scheduleRows.forEach(row => { // Clear previous schedule data
                const cells = row.querySelectorAll('td');
                cells.forEach((cell, index) => {
                    if (index !== 0) { // لا نريد مسح عمود اليوم
                        cell.innerHTML = '';
                    }
                });
            });

            const hashedPassword = CryptoJS.SHA256(password).toString();
            const user = data.find(person => person.user === email && person.pass === hashedPassword);
            


            if (user) {
                resultsDiv.innerHTML = `<p>بياناتك صحيحه   .</p>`;
                accountNameDiv.innerHTML = ` مرحب سياده الدكتور : ${user.subject}`; // عرض اسم الحساب

                // إضافة الجدول الزمني
                user.schedule.forEach(item => {
                    const dayIndex = daysMap[item.day]; // الحصول على الفهرس بناءً على اليوم
                    if (dayIndex !== undefined) {
                        item.times.forEach((time, timeIndex) => {
                            const scheduleCell = scheduleRows[dayIndex].querySelectorAll('td')[timeIndex + 1]; // +1 لتجاوز عمود اليوم
                            if (time.material || time.room) {
                                scheduleCell.innerHTML = `المادة: ${time.material || 'لا توجد بيانات'}<br/>الغرفة: ${time.room || 'لا توجد بيانات'}`;
                            } else {
                                scheduleCell.innerHTML = '  ';
                            }
                        });
                    }
                });
                
                console.log(user.schedule);

            } else {
                resultsDiv.innerHTML = `<p>لا توجد معلومات مرتبطة بهذا البريد الإلكتروني وكلمة المرور.</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            resultsDiv.innerHTML = '<p>حدث خطأ أثناء جلب البيانات.</p>';
        });
});

const daysMap = {
    'السبت': 0,
    'الأحد': 1,
    'الإثنين': 2,
    'الاثنين': 2,
    'الثلاثاء': 3,
    'الأربعاء': 4,
    "الاربع": 4,  
    'الاربعاء': 4,  // إضافة بدون همزة
    'الخميس': 5
};





document.getElementById('downloadPdf').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;  
    const pdf = new jsPDF();
  
    const tableElement = document.getElementById('schedule-table'); 
  
    if (tableElement) {
      html2canvas(tableElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');  
        
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);  
        
        pdf.save('table.pdf');  
      });
    } else {
      console.error('العنصر غير موجود: تحقق من الـ ID الخاص بالجدول');
    }
  });
  
  