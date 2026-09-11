const $ = (id) => document.getElementById(id);
let selectedImage = false;
let selectedImageUrl = '';
let scanData = {healthy:16, damaged:3, rotten:1, sprouted:1, undersized:1, total:22};

// Navigation
document.querySelectorAll('.nav-item').forEach(btn => btn.addEventListener('click', () => showView(btn.dataset.view)));
$('startScan').onclick = () => showView('scan');
$('openReports').onclick = () => showView('reports');
$('newScanFromReports').onclick = () => showView('scan');
$('chooseFile').onclick = (e) => { e.stopPropagation(); $('fileInput').click(); };
$('dropzone').addEventListener('click', e => { if(e.target.tagName !== 'BUTTON') $('fileInput').click(); });
$('fileInput').addEventListener('change', e => handleFile(e.target.files[0]));
$('scanBtn').onclick = runScan;
$('reportBtn').onclick = () => { updateReport(); showView('reports'); };
$('printReport').onclick = () => window.print();

function showView(view){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active-view'));
  $(view).classList.add('active-view');
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active', b.dataset.view===view));
  $('pageTitle').textContent = view==='dashboard'?'Onion Quality Dashboard':view==='scan'?'New AI Quality Scan':'Digital Reports';
  window.scrollTo({top:0,behavior:'smooth'});
}

function handleFile(file){
  if(!file || !file.type.startsWith('image/')) return;
  selectedImage = true;
  const reader = new FileReader();
  reader.onload = e => {
    selectedImageUrl = e.target.result;

    // Show the SAME uploaded image in both the upload preview and the scanner.
    $('previewImg').src = selectedImageUrl;
    $('previewImg').style.display = 'block';
    document.querySelector('.empty-preview').style.display = 'none';

    $('scanImage').src = selectedImageUrl;
    $('scanImage').style.display = 'block';
    $('scanner').classList.add('has-image');

    $('scanBtn').disabled = false;
    $('scanState').textContent = 'Image ready';
    $('scanMessage').textContent = 'Ready to inspect uploaded image';
    $('scanSub').textContent = 'Your onion batch will remain visible during scanning';
    $('processedCount').textContent = '';
    $('boxes').innerHTML = '';
  };
  reader.readAsDataURL(file);
}

function runScan(){
  if(!selectedImageUrl) return;
  $('scanBtn').disabled = true;
  $('reportBtn').classList.add('hidden');
  $('scanState').textContent = 'Scanning…';
  $('scanner').classList.add('scanning','has-image');
  $('scanMessage').textContent = 'AI vision is inspecting your uploaded batch';
  $('scanSub').textContent = 'Detecting defects, size and quality';
  $('processedCount').textContent = '0/22 onions processed';
  $('boxes').innerHTML = '';

  // Demo detection positions. They appear ON TOP OF THE UPLOADED IMAGE,
  // rather than replacing it with a black scanner screen.
  const detections = [
    ['Healthy',92,8,13,14,18],
    ['Healthy',88,49,10,14,18],
    ['Damaged',76,30,24,12,19],
    ['Healthy',91,67,16,12,18],
    ['Rotten',93,53,50,13,20],
    ['Sprouted',81,6,56,12,20],
    ['Undersized',87,34,64,12,18],
    ['Healthy',90,76,54,12,18]
  ];

  detections.forEach((item,i)=>{
    setTimeout(()=>addDetection(item), 500 + i*260);
  });

  // Show progressive processing count while the uploaded image stays visible.
  const progress = [4,7,10,13,16,19,22];
  progress.forEach((count,i)=>{
    setTimeout(()=> $('processedCount').textContent = `${count}/22 onions processed`, 420+i*380);
  });

  setTimeout(()=>{
    $('scanner').classList.remove('scanning');
    $('scanMessage').textContent = 'Inspection complete';
    $('scanSub').textContent = 'All 22 onions analyzed successfully';
    $('processedCount').textContent = '22/22 processed';
    generateResults();
    $('scanState').textContent = 'Complete';
    $('reportBtn').classList.remove('hidden');
    $('scanBtn').disabled = false;
  }, 3300);
}

function addDetection(item){
  const [label,confidence,left,top,width,height] = item;
  const box=document.createElement('div');
  box.className='detect-box';
  box.dataset.label=label.toLowerCase();
  box.style.left=left+'%';
  box.style.top=top+'%';
  box.style.width=width+'%';
  box.style.height=height+'%';
  box.innerHTML=`<span class="detect-label">${label} · ${confidence}%</span>`;
  $('boxes').appendChild(box);
}

function generateResults(){
  // Prototype batch is fixed to the user's 22-onion demo batch.
  // Replace this section with YOLO/OpenCV API results when the real model is connected.
  scanData={healthy:16,damaged:3,rotten:1,sprouted:1,undersized:1,total:22};
  const grade=Math.round(scanData.healthy/scanData.total*100);
  const ids=['healthyCount','damagedCount','rottenCount','sproutedCount','undersizedCount'];
  [scanData.healthy,scanData.damaged,scanData.rotten,scanData.sprouted,scanData.undersized].forEach((v,i)=>$(ids[i]).textContent=v);
  $('gradePercent').textContent=grade+'%';
  $('gradeTitle').textContent=grade>=70?'Grade A — Good Batch':'Review Recommended';
  $('gradeText').textContent=grade>=70?'Most onions meet the Grade A quality threshold.':'Batch contains a higher share of non-grade-A onions.';
  const deg=grade*3.6;
  $('gradeRing').style.background=`conic-gradient(#54a86f ${deg}deg,#dfe7e3 ${deg}deg)`;
  $('totalScans').textContent='13';
  $('gradeAStat').textContent=grade+'%';
  $('ursStat').textContent=(100-grade)+'%';
}

function updateReport(){
  const grade=Math.round(scanData.healthy/scanData.total*100), urs=100-grade;
  $('reportBatch').textContent='Batch #PP-0013 · '+new Date().toLocaleDateString();
  $('reportGrade').textContent=grade+'%';
  $('reportUrs').textContent=urs+'%';
  $('reportTotal').textContent=scanData.total;
  const pairs=[['repHealthy','barHealthy',scanData.healthy],['repDamaged','barDamaged',scanData.damaged],['repRotten','barRotten',scanData.rotten],['repSprouted','barSprouted',scanData.sprouted],['repUndersized','barUndersized',scanData.undersized]];
  pairs.forEach(([n,b,v])=>{$(n).textContent=v;$(b).style.width=(v/scanData.total*100)+'%'});
}
