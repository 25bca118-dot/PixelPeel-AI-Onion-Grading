const $ = (id) => document.getElementById(id);
let selectedImage = false;
let scanData = {healthy:35, damaged:6, rotten:3, sprouted:2, undersized:2, total:48};

document.querySelectorAll('.nav-item').forEach(btn => btn.addEventListener('click', () => showView(btn.dataset.view)));
$('startScan').onclick = () => showView('scan');
$('openReports').onclick = () => showView('reports');
$('newScanFromReports').onclick = () => showView('scan');
$('chooseFile').onclick = () => $('fileInput').click();
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
  if(!file) return;
  selectedImage = true;
  const reader = new FileReader();
  reader.onload = e => {
    $('previewImg').src = e.target.result;
    $('previewImg').style.display='block';
    document.querySelector('.empty-preview').style.display='none';
    $('scanBtn').disabled=false;
    $('scanState').textContent='Image ready';
  };
  reader.readAsDataURL(file);
}

function runScan(){
  $('scanBtn').disabled=true;
  $('scanState').textContent='Scanning…';
  $('scanner').classList.add('scanning');
  $('scanMessage').textContent='AI vision is inspecting the batch';
  $('scanSub').textContent='Detecting defects, size and quality';
  $('boxes').innerHTML='';
  const labels=['Healthy','Healthy','Damaged','Healthy','Rotten','Sprouted','Healthy','Undersized'];
  labels.forEach((label,i)=>{
    setTimeout(()=>{
      const box=document.createElement('div');
      box.className='detect-box';
      box.style.left=(8+((i*17)%75))+'%';
      box.style.top=(13+((i*23)%63))+'%';
      box.style.width=(9+(i%3)*3)+'%';
      box.style.height=(14+(i%2)*7)+'%';
      box.innerHTML=`<span class="detect-label">${label} · ${(91+i%7)}%</span>`;
      $('boxes').appendChild(box);
    },450+i*230);
  });
  setTimeout(()=>{
    $('scanner').classList.remove('scanning');
    $('scanMessage').textContent='Inspection complete';
    $('scanSub').textContent='Quality classes detected successfully';
    generateResults();
    $('scanState').textContent='Complete';
    $('reportBtn').classList.remove('hidden');
    $('scanBtn').disabled=false;
  },3300);
}

function generateResults(){
  const variance=Math.floor(Math.random()*7)-3;
  scanData.healthy=Math.max(1,35+variance);
  scanData.damaged=6;
  scanData.rotten=3;
  scanData.sprouted=2;
  scanData.undersized=2;
  scanData.total=scanData.healthy+13;
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
  $('reportGrade').textContent=grade+'%'; $('reportUrs').textContent=urs+'%'; $('reportTotal').textContent=scanData.total;
  const pairs=[['repHealthy','barHealthy',scanData.healthy],['repDamaged','barDamaged',scanData.damaged],['repRotten','barRotten',scanData.rotten],['repSprouted','barSprouted',scanData.sprouted],['repUndersized','barUndersized',scanData.undersized]];
  pairs.forEach(([n,b,v])=>{$(n).textContent=v;$(b).style.width=(v/scanData.total*100)+'%'});
}
