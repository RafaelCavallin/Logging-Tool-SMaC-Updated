// Avoiding page refresh.
window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  // Chrome requires returnValue to be set.
  e.returnValue = "";
});

function alertSuccess(div) {
  document.getElementById(div).classList.remove("d-none");

  setTimeout(function () {
    document.getElementById(div).classList.add("d-none");
  }, 3000);
}

function checkAdditionalFailure() {
  return document.getElementById('additional_failure').checked ? 'Invoice attached' : '';
}

function checkBackup() {
  return document.getElementById('backup').checked ? 'Aware of backup' : '';
}

function checkInvoice() {
  return document.getElementById('invoice').checked ? 'No additional failure' : '';
}

function createFinalLog(issue, troubleshooting, actionPlan, conclusions, historyDPS, additionalsVerifications) {
  return `
ISSUE:
${issue}
__________________________
TROUBLESHOOT:
${additionalsVerifications}
-------------------------
${troubleshooting}
__________________________
ACTION PLAN:
${actionPlan}
__________________________
CONCLUSION:
${conclusions}
__________________________
DISPATCH HISTORY:
${historyDPS}`;
}

function sendFinalLogToClipboard(finalLog) {
  navigator.clipboard.writeText(finalLog);

  alertSuccess('alertCopied');
}

function insertOkbToLog() {
  let okbUsed = document.getElementById("okb").value;
  let okbSelectedUsed = document.getElementById("okb_selected").value;
  let troubleshooting = document.getElementById("troubleshooting");

  if (okbUsed != "") {
    troubleshooting.value += `OKB ${okbUsed}\n`;
    openOKB(okbUsed);
    document.getElementById("okb").value = "";
  } else if (okbSelectedUsed != "") {
    troubleshooting.value += `OKB ${okbSelectedUsed}\n`;
    openOKB(okbSelectedUsed);
    document.getElementById("okb_selected").value = "";
  }
}

function openOKB(urlParam) {
  url = `https://kb.dell.com/infocenter/index?page=content&id=${urlParam}&viewlocale=pt_PT`;
  window.open(url, "_blank");
}

const form = document.getElementById("formTool");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  let issue = document.getElementById('issue').value;
  let troubleshooting = document.getElementById('troubleshooting').value;
  let actionPlan = document.getElementById('actionPlan').value;
  let conclusions = document.getElementById('conclusions').value;
  let historyDPS = document.getElementById('historyDPS').value;

  let additionalsVerifications = `${checkAdditionalFailure()} - ${checkBackup()} - ${checkInvoice()} `;

  createFinalLog(issue, troubleshooting, actionPlan, conclusions, historyDPS, additionalsVerifications);

  sendFinalLogToClipboard(createFinalLog(issue, troubleshooting, actionPlan, conclusions, historyDPS, additionalsVerifications));

});

const osForm = document.getElementById("osForm");
osForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let architecture = document.getElementById('architecture').value;
  let language = document.getElementById('language').value;
  let modelSystem = document.getElementById('modelSystem').value;
  let systemVersion = document.getElementById('systemVersion').value;

  let osLog = 'OS Download: ' + architecture + ', Language: ' + language + ', Model: ' + modelSystem + ', OS: ' + systemVersion;

  sendFinalLogToClipboard(osLog);
  alertSuccess('alertCopiedOsImage');
  osForm.reset();
});

// CPF Function
const formCpf = document.getElementById("formCpf");
formCpf.addEventListener("submit", function (e) {
  e.preventDefault();

  let partsOnly = document.getElementById('partsOnly').checked;
  let ckbCpf = document.getElementById('ckbCpf').checked;

  let cpfField = document.getElementById('cpfField').value;
  let ie = document.getElementById('ie').value;
  let bdate = document.getElementById('bdate').value;

  if (ckbCpf && partsOnly) {
    cpfLog = "FEDERAL:" + cpfField + "-STATE:ISENTO-BDATE:" + bdate;
  }

  if (ckbCpf && !partsOnly) {
    cpfLog = "CPF:" + cpfField + "-BDATE:" + bdate;
  }

  if (!ckbCpf && !partsOnly) {
    cpfLog = "FEDERAL:" + cpfField + "-STATE:" + ie;
  }

  if (!ckbCpf && partsOnly) {
    cpfLog = "FEDERAL:" + cpfField + "-STATE:" + ie + "-";
  }

  sendFinalLogToClipboard(cpfLog);
  alertSuccess('alertCopiedCpf');
  formCpf.reset();
});