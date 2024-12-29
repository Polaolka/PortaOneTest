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
  const file = event.target.files[0];
  if (!file) {
    alert('Будь ласка, виберіть файл.');
    return;
  }
  let result = '';
  let longestPath = [];
  const reader = new FileReader();
  reader.onload = function (e) {
    const content = e.target.result;
    const numbers = content
      .split(/[\s,]+/)
      .filter(Boolean)
      .filter(str => /^\d+$/.test(str));

    // Виконуємо обчислення
    longestPath = findLongestPathWithOptimization(numbers);
    result = buildCombinedString(longestPath);
    document.getElementById('result').textContent = `Результат: ${result}`;

    console.log('Найдовший ланцюжок:', longestPath);
    console.log("Об'єднаний рядок:", result);
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

// Фільтрація чисел, які не можуть бути частиною довгого шляху
function filterNumbers(numbers) {
  console.log('Фільтрація чисел, які не можуть бути частиною довгого шляху');

  const prefixes = new Set(numbers.map(num => num.slice(0, 2)));
  const suffixes = new Set(numbers.map(num => num.slice(-2)));
  return numbers.filter(
    num => prefixes.has(num.slice(-2)) || suffixes.has(num.slice(0, 2))
  );
}

function findLongestPathWithOptimization(numbers) {
  const graph = buildGraph(numbers);
  const memo = new Map();
  let longestPath = [];
  let calculationInterrupted = false;
  console.log('calculationInterrupted', calculationInterrupted);

  const timer = setTimeout(() => {
    calculationInterrupted = true;
  }, 60000); // 60 секунд

  // Жадібна оптимізація для раннього грубого розв'язку
  console.log("Жадібна оптимізація для раннього грубого розв'язку");

  function greedyPath(start) {
    const path = [start];
    let current = start;
    if (calculationInterrupted) {
      return [];
    } // Зупинити, якщо час вичерпано
    while (true) {
      const suffix = current.slice(-2);
      const candidates = (graph[suffix] || []).filter(
        next => !path.includes(next)
      );
      if (candidates.length === 0) break;
      current = candidates[0];
      path.push(current);
    }
    return path;
  }

  // Точний DFS з мемоізацією
  function dfs(current, path) {
    if (calculationInterrupted) {
      console.log(
        'Обчислення зайняло забагато часу. Виберіть меншу точність і повторіть спробу.'
      );

      document.getElementById('result').textContent =
        'Обчислення зайняло забагато часу. Виберіть меншу точність і повторіть спробу.';
      return [];
    }
    const key = `${current}:${path.join(',')}`;
    if (memo.has(key)) return memo.get(key);

    const suffix = current.slice(-2);
    const nextNumbers = graph[suffix] || [];
    let maxPath = [...path];

    for (let next of nextNumbers) {
      if (!path.includes(next)) {
        const newPath = dfs(next, [...path, next]);
        if (newPath.length > maxPath.length) {
          maxPath = newPath;
        }
      }
    }

    memo.set(key, maxPath);
    return maxPath;
  }

  const filteredNumbers = filterNumbers(numbers);
  let greedyMaxPath = [];

  // Виконуємо жадібний алгоритм для кожного стартового числа
  for (let start of filteredNumbers) {
    if (calculationInterrupted) break;
    const greedyPathResult = greedyPath(start);
    if (greedyPathResult.length > greedyMaxPath.length) {
      greedyMaxPath = greedyPathResult;
    }
  }
  if (precisionChecker.highPrecision) {
    console.log(precisionChecker.highPrecision);
    console.log('рахуємо довго!');
    document.getElementById('puzzle-info').textContent = 'Pахуємо довго!';

    // DFS з урахуванням знайденого грубого розв'язку
    for (let start of filteredNumbers) {
      if (calculationInterrupted) break;
      const path = dfs(start, [start]);
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
  return greedyMaxPath;
}

function buildCombinedString(longestPath) {
  let result = longestPath[0];
  for (let i = 1; i < longestPath.length; i++) {
    result += longestPath[i].slice(2);
  }
  return result;
}
