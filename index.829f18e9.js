document.getElementById("fileInput").addEventListener("change",function(e){document.getElementById("puzzle-info").textContent="",document.getElementById("result").textContent="";let n=e.target.files[0];if(!n){alert("Будь ласка, виберіть файл.");return}let l="",r=new FileReader;r.onload=async function(e){let n=e.target.result.split(/[\s,]+/).filter(Boolean).filter(e=>/^\d+$/.test(e));l=function(e){let t=e[0];for(let n=1;n<e.length;n++)t+=e[n].slice(2);return t}(await t(n)),document.getElementById("result").textContent=`\u{420}\u{435}\u{437}\u{443}\u{43B}\u{44C}\u{442}\u{430}\u{442}: ${l}`},r.readAsText(n),e.target.value=""}),document.querySelector(".precision-toggler").addEventListener("change",function(t){t.target.checked?e.highPrecision=!0:e.highPrecision=!1});const e={highPrecision:!1};async function t(t){let r=function(e){console.log("Будуємо граф");let t={};return e.forEach(n=>{let l=n.slice(-2);t[l]||(t[l]=[]),e.forEach(e=>{e!==n&&e.slice(0,2)===l&&t[l].push(e)})}),t}(t),i=[],o=!1,u=setTimeout(()=>{o=!0},6e4);console.log("'Жадібна' оптимізація");let a=function(e){let t=new Set(e.map(e=>e.slice(0,2))),n=new Set(e.map(e=>e.slice(-2)));return e.filter(e=>t.has(e.slice(-2))||n.has(e.slice(0,2)))}(t),c=[];for(let e of a){if(o)break;let t=await n({start:e,calculationInterrupted:o,graph:r});t.length>c.length&&(c=t)}if(e.highPrecision){for await(let e of(console.log("рахуємо довго!"),document.getElementById("puzzle-info").textContent="Pахуємо довго!",await new Promise(e=>setTimeout(e,0)),a)){if(o)break;let t=await l({current:e,path:[e],calculationInterrupted:o,graph:r});t.length>i.length&&(i=t)}return(clearTimeout(u),o)?(document.getElementById("result").textContent="Обчислення зайняло забагато часу. Виберіть меншу точність і повторіть спробу.",[]):i.length>c.length?i:c}return clearTimeout(u),c}async function n({start:e,calculationInterrupted:t,graph:n}){let l=[e],r=e;for(;;){if(t)return[];let e=(n[r.slice(-2)]||[]).filter(e=>!l.includes(e));if(0===e.length)break;r=e[0],l.push(r),await new Promise(e=>setTimeout(e))}return l}async function l({start:e,graph:t,calculationInterrupted:n}){let l=[{current:e,path:[e]}],r=[],i=new Set;for(;l.length>0&&!n;){let{current:e,path:n}=l.pop();if(e){for(let o of(i.add(e),n.length>r.length&&(r=n),t[e.slice(-2)]||[]))n.includes(o)||l.push({current:o,path:[...n,o]});await new Promise(e=>setTimeout(e,0))}}return r}
//# sourceMappingURL=index.829f18e9.js.map
