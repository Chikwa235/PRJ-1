document.addEventListener('DOMContentLoaded', () => {
    
// Utilities
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  return phoneRegex.test(phone);
}

 function addEducation() {
  let eduCount = parseInt(document.getElementById('eduCount').value);
  eduCount++;
  document.getElementById('eduCount').value = eduCount;

  const container = document.getElementById('educationContainer');
  const newBlock = document.createElement('div');
  newBlock.className = 'input-group';
  newBlock.id = `eduBlock${eduCount}`;
  newBlock.innerHTML = `
    <label>Institution</label>
    <input type="text" id="institution${eduCount}" />

    <label>Degree / Diploma (optional)</label>
    <input type="text" id="degree${eduCount}" />

    <label>Field of Study / Major</label>
    <input type="text" id="field${eduCount}" />

    <label>Year Started</label>
    <input type="text" id="yearStart${eduCount}" />

    <label>Year Completed</label>
    <input type="text" id="yearEnd${eduCount}" />

    <label>Grade / GPA (optional)</label>
    <input type="text" id="grade${eduCount}" />
  `;
  container.appendChild(newBlock);
}

  function addExperience() {
  let expCount = parseInt(document.getElementById('expCount').value);
  expCount++;
  document.getElementById('expCount').value = expCount;

  const container = document.getElementById('experienceContainer');
  const newBlock = document.createElement('div');
  newBlock.className = 'input-group';
  newBlock.id = `expBlock${expCount}`;
  newBlock.innerHTML = `
    <label>Job Title</label>
    <input type="text" id="jobTitle${expCount}" />

    <label>Company Name</label>
    <input type="text" id="company${expCount}" />

    <label>Location (City, Country)</label>
    <input type="text" id="location${expCount}" />

    <label>Start Date</label>
    <input type="text" id="expStart${expCount}" />

    <label>End Date (or "Present")</label>
    <input type="text" id="expEnd${expCount}" />

    <label>Key Responsibilities / Achievements</label>
    <textarea id="responsibilities${expCount}"></textarea>
  `;
  container.appendChild(newBlock);
}
// Theme switching
const themeSelector = document.getElementById('themeSelector');
themeSelector.addEventListener('change', e => {
  document.body.className = e.target.value;
});

// Profile Picture Preview
const profilePicInput = document.getElementById('profilePic');
const profilePreview = document.getElementById('profilePreview');
let profilePicDataUrl = '';

profilePicInput.addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) {
    profilePreview.style.display = 'none';
    profilePicDataUrl = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    profilePicDataUrl = e.target.result;
    profilePreview.src = profilePicDataUrl;
    profilePreview.style.display = 'block';
  };
  reader.readAsDataURL(file);
});

// Generate CV Preview
const eduCount = parseInt(document.getElementById('eduCount').value);
const expCount = parseInt(document.getElementById('expCount').value);
function generateCV() {
  const get = id => document.getElementById(id)?.value.trim() || '';
  const required = ['name', 'location', 'phone', 'email', 'summary', 'skills'];
  const missing = required.filter(id => !get(id));

  if (missing.length > 0) {
    missing.forEach(id => {
      const el = document.getElementById(id);
      el.style.border = '2px solid red';
      setTimeout(() => el.style.border = '', 2000);
    });

    const errorMsg = document.getElementById('errorMsg');
    errorMsg.style.display = 'block';
    setTimeout(() => errorMsg.style.display = 'none', 3000);
    return;
  }

  if (!isValidEmail(get('email'))) {
    alert('Invalid email format');
    return;
  }

  if (!isValidPhone(get('phone'))) {
    alert('Invalid phone number');
    return;
  }

  const skills = get('skills').split(',').map(s => '- ' + s.trim()).join('\n');
  const certs = get('certifications_and_Learning') ? get('certifications_and_Learning').split('\n').map(c => '- ' + c.trim()).join('\n') : 'N/A';

      // Build dynamic education section
let education = '';
for (let i = 1; i <= eduCount; i++) {
  const institution = get(`institution${i}`);
  const degree = get(`degree${i}`);
  const field = get(`field${i}`);
  const yearStart = get(`yearStart${i}`);
  const yearEnd = get(`yearEnd${i}`);
  const grade = get(`grade${i}`);

  if (institution || degree || field || yearStart || yearEnd || grade) {
    education += `${degree || 'Degree/Diploma'}${field ? ', ' + field : ''} from ${institution || 'Institution'} (${yearStart || 'Start'} - ${yearEnd || 'End'})${grade ? ', Grade/GPA: ' + grade : ''}\n`;
  }
}
 
// Build dynamic experience section
let experience = '';
for (let i = 1; i <= expCount; i++) {
  const title = get(`title${i}`);
  const company = get(`company${i}`);
  const location = get(`location${i}`);
  const startDate = get(`startDate${i}`);
  const endDate = get(`endDate${i}`);
  const description = get(`description${i}`);

  if (title || company || location || startDate || endDate || description) {
    experience += `${title || 'Job Title'} at ${company || 'Company'} in ${location || 'Location'} (${startDate || 'Start'} - ${endDate || 'End'})\n${description || 'Job Description'}\n\n`;
  }
}

const cvText = `
${get('name')}
${get('location')}
Phone: ${get('phone')}     Email: ${get('email')}
${get('linkedin') ? 'LinkedIn: ' + get('linkedin') : ''}
${get('github') ? 'GitHub: ' + get('github') : ''}
${get('portfolio') ? 'Portfolio: ' + get('portfolio') : ''}

==============================
Professional Summary
==============================
${get('summary')}

==============================
Technical Skills
==============================
${skills}

==============================
Experience
==============================
${experience || 'N/A'}

==============================
Education
==============================
${education || 'N/A'}

==============================
Certifications
==============================
${certs}

==============================
Additional Info
==============================
${get('additional')}

${profilePicDataUrl ? '[Profile Picture included below]' : ''}

References available upon request.`;

  document.getElementById('output').textContent = cvText;
}

 
// Download PDF
async function downloadCV() {
  const required = ['name', 'location', 'phone', 'email', 'summary', 'skills'];
  const missing = required.filter(id => !document.getElementById(id).value.trim());

  if (missing.length > 0) {
    missing.forEach(id => {
      const el = document.getElementById(id);
      el.style.border = '2px solid red';
      setTimeout(() => el.style.border = '', 2000);
    });

    const errorMsg = document.getElementById('errorMsg');
    errorMsg.style.display = 'block';
    setTimeout(() => errorMsg.style.display = 'none', 3000);
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const get = id => document.getElementById(id).value.trim();
  let y = 15;

  if (profilePicDataUrl) {
    try {
      const props = doc.getImageProperties(profilePicDataUrl);
      const width = 40;
      const height = (props.height * width) / props.width;
      doc.addImage(profilePicDataUrl, 'JPEG', doc.internal.pageSize.getWidth() - 10 - width, y, width, height);
    } catch (e) {
      console.warn('Image not added:', e);
    }
  }

    // Build education section manually from dynamic blocks
let education = '';
const eduCount = parseInt(document.getElementById('eduCount').value);

for (let i = 1; i <= eduCount; i++) {
  const institution = get(`institution${i}`);
  const degree = get(`degree${i}`);
  const field = get(`field${i}`);
  const yearStart = get(`yearStart${i}`);
  const yearEnd = get(`yearEnd${i}`);
  const grade = get(`grade${i}`);

  if (institution || degree || field || yearStart || yearEnd || grade) {
    education += 
      `Institution: ${institution || 'N/A'}\n` +
      `Degree/Diploma: ${degree || 'N/A'}\n` +
      `Field of Study: ${field || 'N/A'}\n` +
      `Year Started: ${yearStart || 'N/A'}\n` +
      `Year Completed: ${yearEnd || 'N/A'}\n` +
      `Grade/GPA: ${grade || 'N/A'}\n\n`;
  }
}

// Build experience section manually from dynamic blocks
let experience = '';
const expCount = parseInt(document.getElementById('expCount').value);

for (let i = 1; i <= expCount; i++) {
  const company = get(`company${i}`);
  const role = get(`jobTitle${i}`);
  const expStart = get(`expStart${i}`);
  const expEnd = get(`expEnd${i}`);
  const responsibilities = get(`responsibilities${i}`);

  if (company || role || expStart || expEnd || responsibilities) {
    experience += 
      `Company: ${company || 'N/A'}\n` +
      `Role: ${role || 'N/A'}\n` +
      `Start Date: ${expStart || 'N/A'}\n` +
      `End Date: ${expEnd || 'N/A'}\n` +
      `Responsibilities: ${responsibilities || 'N/A'}\n\n`;
  }
}

const sections = {
  'Name & Contact': `${get('name')}
${get('location')}
Phone: ${get('phone')}  Email: ${get('email')}
${get('linkedin') ? 'LinkedIn: ' + get('linkedin') : ''}
${get('github') ? 'GitHub: ' + get('github') : ''}
${get('portfolio') ? 'Portfolio: ' + get('portfolio') : ''}`.trim(),
  'Professional Summary': get('summary'),
  'Technical Skills': get('skills').split(',').map(s => '- ' + s.trim()).join('\n'),
   'Experience': experience,
  'Education': education,
     'Certifications': get('certifications_and_Learning') || 'N/A',

  'Additional Info': get('additional')
};

  Object.entries(sections).forEach(([title, content]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(title, 10, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(content, 180);
    lines.forEach(line => {
      if (y > 270) {
        doc.addPage();
        y = 15;
      }
      doc.text(line, 10, y);
      y += 6;
    });
    y += 5;
  });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.text('References available upon request.', 10, y);
  doc.save('My_CV.pdf');
}

// Button bindings
document.getElementById('generateBtn').addEventListener('click', generateCV);
document.getElementById('downloadBtn').addEventListener('click', downloadCV);

});
