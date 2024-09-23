

const apiUrl = 'https://66cb41954290b1c4f199e054.mockapi.io/assistant';
let data = [];

// Fetch data from API
fetch(apiUrl)
  .then(response => response.json())
  .then(jsonData => {
    data = jsonData; // Store data for later use
    populateDoctorList(); // Populate the dropdown list with doctor names
  })
  .catch(error => console.error('Error fetching data:', error));

// Populate the dropdown list with doctor names
function populateDoctorList() {
  const doctorList = document.getElementById('doctorList');
  data.forEach(doctor => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.className = 'dropdown-item custom-dropdown-item';
    link.href = '#';
    link.textContent = doctor.subject;
    link.addEventListener('click', () => displayData(doctor.id));
    listItem.appendChild(link);
    doctorList.appendChild(listItem);
  });
}

// Function to display data for the specified ID
// تحديث displayData لإضافة حقول إدخال
function displayData(id) {
  const item = data.find(d => d.id === id);
  const subjectTitle = document.getElementById('subject-title');
  const scheduleTableBody = document.querySelector('#schedule-table tbody');

  // تفريغ الجدول قبل ملئه
  scheduleTableBody.innerHTML = '';

  if (item) {
    subjectTitle.textContent = item.subject;

    item.schedule.forEach(schedule => {
      const row = document.createElement('tr');
      const dayCell = document.createElement('td');
      dayCell.textContent = schedule.day;
      row.appendChild(dayCell);

      schedule.times.forEach((time, index) => {
        const cell = document.createElement('td');

        // عرض المادة كـ نص
        const materialText = document.createElement('span');
        materialText.textContent = time.material;
        
        // عرض الغرفة كـ نص
        const roomText = document.createElement('span');
        if (time.room) {
          roomText.textContent = ` (غرفة: ${time.room})`;
        }else {
          roomText.textContent = '';
        }
        // roomText.textContent = ` (غرفة: ${time.room})`;

        // حقل إدخال لاسم المادة (مخفي افتراضيًا)
        const inputMaterial = document.createElement('input');
        inputMaterial.type = 'text';
        inputMaterial.value = time.material;
        inputMaterial.className = 'material-input form-control hidden'; // مخفي
        inputMaterial.placeholder = 'اسم المادة';
        
        // حقل إدخال لرقم الغرفة (مخفي افتراضيًا)
        const inputRoom = document.createElement('input');
        inputRoom.type = 'text';
        inputRoom.value = time.room;
        inputRoom.className = 'room-input form-control hidden'; // مخفي
        inputRoom.placeholder = 'رقم الغرفة';

        // إضافة النصوص الثابتة وحقل الإدخال إلى الخلية
        cell.appendChild(materialText);
        cell.appendChild(roomText);
        cell.appendChild(inputMaterial);
        cell.appendChild(inputRoom);
        row.appendChild(cell);
      });

      scheduleTableBody.appendChild(row);
    });
  } else {
    subjectTitle.textContent = 'لا توجد بيانات لهذا الرقم.';
  }
}



  
  document.getElementById('save-schedule').addEventListener('click', saveSchedule);

  function saveSchedule() {
    const subjectTitle = document.getElementById('subject-title').textContent;
    const selectedDoctorId = data.find(d => d.subject === subjectTitle).id;
    const updatedSchedule = [];
  
    const rows = document.querySelectorAll('#schedule-table tbody tr');
    rows.forEach(row => {
      const day = row.cells[0].textContent; // اليوم
      const times = [];
  
      for (let i = 1; i < row.cells.length; i++) { // بدء من الخلية الثانية
        const inputMaterial = row.cells[i].querySelector('.material-input'); // حقل المادة
        const inputRoom = row.cells[i].querySelector('.room-input'); // حقل الغرفة
        
        if (inputMaterial.value && inputRoom.value) { // إذا كانت الخلايا غير فارغة
          times.push({
            material: inputMaterial.value.trim(),
            room: inputRoom.value.trim()
          });
        }else{
            times.push({
                material: "",
                room: ""
              }); 
        }

      }
  
      updatedSchedule.push({ day, times });
      // window.location.reload();
    });
  
    const body = {
      subject: subjectTitle,
      schedule: updatedSchedule
    };
  
    fetch(`${apiUrl}/${selectedDoctorId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('تم تحديث البيانات بنجاح:', data);
      alert('تم حفظ الجدول بنجاح!');
    })
    .catch(error => {
      console.error('حدث خطأ أثناء تحديث البيانات:', error);
      alert('فشل في حفظ الجدول.');
    });
  }
  

  const inputRoom = document.createElement('input');
inputRoom.type = 'text';
// inputRoom.value = period.includes('غرفة:') ? period.split(' (غرفة: ')[1].replace(')', '') : '';
inputRoom.className = 'room-input form-control'; // إضافة class لـ Bootstrap
inputRoom.placeholder = 'رقم الغرفة';


document.getElementById('add-doctor').addEventListener('click', addDoctor);

function addDoctor() {
  const newDoctorName = prompt('أدخل اسم المعيد الجديد:');

  if (newDoctorName) {
    const newDoctor = {
      subject: newDoctorName,
      schedule: [
        { day: "السبت", times: Array(6).fill({ material: "", room: "" }) },
        { day: "الأحد", times: Array(6).fill({ material: "", room: "" }) },
        { day: "الاثنين", times: Array(6).fill({ material: "", room: "" }) },
        { day: "الثلاثاء", times: Array(6).fill({ material: "", room: "" }) },
        { day: "الاربع", times: Array(6).fill({ material: "", room: "" }) },
        { day: "الخميس", times: Array(6).fill({ material: "", room: "" }) }
      ]
    };

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newDoctor)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('تم إضافة المعيد بنجاح:', data);
      alert('تم إضافة المعيد بنجاح!');
      window.location.reload();
        })
    .catch(error => {
      console.error('حدث خطأ أثناء إضافة المعيد:', error);
      alert('فشل في إضافة المعيد.');
    });
  } else {
    alert('يرجى إدخال اسم المعيد.');
  }
}

document.getElementById('delete-doctor').addEventListener('click', deleteDoctor);

function deleteDoctor() {
  const doctorName = prompt('أدخل اسم المعيد الذي تريد حذفه:');

  if (doctorName) {
    const doctorToDelete = data.find(d => d.subject === doctorName);

    if (doctorToDelete) {
      fetch(`${apiUrl}/${doctorToDelete.id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('تم حذف المعيد بنجاح:', data);
        alert('تم حذف المعيد بنجاح!');
        // إعادة تحميل قائمة الدكاتره لتحديثها
        window.location.reload();
      })
      .catch(error => {
        console.error('حدث خطأ أثناء حذف المعيد:', error);
        alert('فشل في حذف المعيد.');
      });
    } else {
      alert('لا يوجد دكتور بهذا الاسم.');
    }
  } else {
    alert('يرجى إدخال اسم المعيد.');
  }
}


// عند الضغط على زر "تعديل"
document.getElementById('edit-schedule').addEventListener('click', function() {
  // إخفاء النصوص الثابتة وإظهار الحقول القابلة للتعديل
  const materialInputs = document.querySelectorAll('.material-input');
  const roomInputs = document.querySelectorAll('.room-input');
  const materialTexts = document.querySelectorAll('span');

  materialInputs.forEach(input => {
    input.classList.remove('hidden'); // إظهار حقول الإدخال
  });

  roomInputs.forEach(input => {
    input.classList.remove('hidden'); // إظهار حقول الإدخال
  });

  materialTexts.forEach(text => {
    text.style.display = 'none'; // إخفاء النصوص الثابتة
  });
});


document.getElementById('download-pdf').addEventListener('click', function() {
  const { jsPDF } = window.jspdf;
  
  const doctorName = document.getElementById('subject-title').textContent;

  const tableElement = document.getElementById('schedule-table');

  // تحويل العنصر إلى صورة باستخدام html2canvas
  html2canvas(tableElement, {
      scale: 2 // زيادة الدقة
  }).then(function(canvas) {
      const imgData = canvas.toDataURL('image/png'); // تحويل الصورة إلى بيانات بصيغة PNG
      const pdf = new jsPDF();

      // إضافة الصورة إلى ملف PDF
      pdf.addImage(imgData, 'PNG', 10, 20, 190, 0); // ضبط الأبعاد حسب الصفحة

      pdf.save(`${doctorName}_schedule.pdf`);
  });
});
