document.getElementById('fileInput').addEventListener('change', handleFile);
const precisionTogglerEl = document.querySelector('.precision-toggler');
precisionTogglerEl.addEventListener('change', handleChoicePrecision);

const precisionChecker = { highPrecision: false };

function handleChoicePrecision(e) {
  const userChoice = e.target.checked ? true : false;
  if (userChoice) {
    precisionChecker.highPrecision = true;
  } else {
    precisionChecker.highPrecision = false;
  }
}

function handleFile(event) {
  document.getElementById('puzzle-info').textContent = '';
  document.getElementById('result').textContent = '';
  const file = event.target.files[0];
  if (!file) {
    alert('Будь ласка, виберіть файл.');
    return;
  }
  let result = '';
  let longestPath = [];
  const reader = new FileReader();
  reader.onload = async function (e) {
    const content = e.target.result;
    const numbers = content
      .split(/[\s,]+/)
      .filter(Boolean)
      .filter(str => /^\d+$/.test(str));

    longestPath = await findLongestPathWithOptimization(numbers);
    result = buildCombinedString(longestPath);
    document.getElementById('result').textContent = `Результат: ${result}`;
  };
  reader.readAsText(file);
  event.target.value = '';
}

function buildGraph(numbers) {
  console.log('Будуємо граф');

  const graph = {};
  numbers.forEach(num => {
    const suffix = num.slice(-2);
    if (!graph[suffix]) graph[suffix] = [];
    numbers.forEach(candidate => {
      if (candidate !== num && candidate.slice(0, 2) === suffix) {
        graph[suffix].push(candidate);
      }
    });
  });
  return graph;
}

async function findLongestPathWithOptimization(numbers) {
  const graph = buildGraph(numbers);

  let longestPath = [];
  let calculationInterrupted = false;

  const timer = setTimeout(() => {
    calculationInterrupted = true;
  }, 60000);

  console.log("'Жадібна' оптимізація");

  const filteredNumbers = filterNumbers(numbers);
  let greedyMaxPath = [];

  for (let start of filteredNumbers) {
    if (calculationInterrupted) break;
    const greedyPathResult = await greedyPath({
      start,
      calculationInterrupted,
      graph,
    });
    if (greedyPathResult.length > greedyMaxPath.length) {
      greedyMaxPath = greedyPathResult;
    }
  }

  if (precisionChecker.highPrecision) {
    console.log('рахуємо довго!');
    document.getElementById('puzzle-info').textContent = 'Pахуємо довго!';
    await new Promise(resolve => setTimeout(resolve, 0));

    for await (let start of filteredNumbers) {
      if (calculationInterrupted) break;
      const path = await dfs({
        current: start,
        path: [start],
        calculationInterrupted,
        graph,
      });
      if (path.length > longestPath.length) {
        longestPath = path;
      }
    }

    clearTimeout(timer);

    if (calculationInterrupted) {
      document.getElementById('result').textContent =
        'Обчислення зайняло забагато часу. Виберіть меншу точність і повторіть спробу.';
      return [];
    }

    return longestPath.length > greedyMaxPath.length
      ? longestPath
      : greedyMaxPath;
  }

  clearTimeout(timer);

  return greedyMaxPath;
}

function buildCombinedString(longestPath) {
  let result = longestPath[0];
  for (let i = 1; i < longestPath.length; i++) {
    result += longestPath[i].slice(2);
  }
  return result;
}

function filterNumbers(numbers) {
  const prefixes = new Set(numbers.map(num => num.slice(0, 2)));
  const suffixes = new Set(numbers.map(num => num.slice(-2)));
  return numbers.filter(
    num => prefixes.has(num.slice(-2)) || suffixes.has(num.slice(0, 2))
  );
}

async function greedyPath({ start, calculationInterrupted, graph }) {
  const path = [start];
  let current = start;
  while (true) {
    if (calculationInterrupted) return [];
    const suffix = current.slice(-2);
    const candidates = (graph[suffix] || []).filter(
      next => !path.includes(next)
    );
    if (candidates.length === 0) break;
    current = candidates[0];
    path.push(current);
    await new Promise(resolve => setTimeout(resolve));
  }
  return path;
}

async function dfs({ start, graph, calculationInterrupted }) {
  const stack = [{ current: start, path: [start] }];
  let longestPath = [];
  const visited = new Set();

  while (stack.length > 0) {
    if (calculationInterrupted) break;

    const { current, path } = stack.pop();
    if (!current) continue;
    visited.add(current);

    if (path.length > longestPath.length) {
      longestPath = path;
    }

    const suffix = current.slice(-2);
    const nextNumbers = graph[suffix] || [];

    for (const next of nextNumbers) {
      if (!path.includes(next)) {
        stack.push({
          current: next,
          path: [...path, next],
        });
      }
    }

    // Додаткова пауза, щоб не блокувати основний потік
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  return longestPath;
}
