// Функція для побудови графа
function buildGraph(numbers) {
  const graph = {};

  numbers.forEach(num => {
    const suffix = num.slice(-2); // Останні дві цифри
    if (!graph[suffix]) graph[suffix] = [];

    numbers.forEach(candidate => {
      if (candidate !== num && candidate.slice(0, 2) === suffix) {
        graph[suffix].push(candidate);
      }
    });
  });

  return graph;
}

// Фільтрація стартових чисел
function filterStartingNumbers(numbers) {
  const prefixes = new Set(numbers.map(num => num.slice(0, 2)));
  return numbers.filter(num => prefixes.has(num.slice(-2)));
}

// Ітеративний DFS з мемоізацією
function findLongestPathWithMemoization(numbers) {
  const graph = buildGraph(numbers);
  const memo = {};
  let longestPath = [];

  function dfs(node, path) {
    if (memo[node]) return memo[node]; // Повернути збережений результат

    let maxPath = [...path];

    (graph[node.slice(-2)] || []).forEach(neighbor => {
      if (!path.includes(neighbor)) {
        const newPath = dfs(neighbor, [...path, neighbor]);
        if (newPath.length > maxPath.length) {
          maxPath = newPath;
        }
      }
    });

    memo[node] = maxPath; // Зберегти результат для вузла
    return maxPath;
  }

  // Обробка всіх стартових чисел
  const filteredNumbers = filterStartingNumbers(numbers);

  filteredNumbers.forEach(startNode => {
    const currentPath = dfs(startNode, [startNode]);
    if (currentPath.length > longestPath.length) {
      longestPath = currentPath;
    }
  });

  return longestPath;
}

// Знаходимо найдовший шлях
const longestPathMemo = findLongestPathWithMemoization(numbers);

// Формуємо об'єднаний рядок
let resultMemo = longestPathMemo[0];
for (let i = 1; i < longestPathMemo.length; i++) {
  resultMemo += longestPathMemo[i].slice(2);
}

console.log('Найдовший ланцюжок:', longestPathMemo);
console.log("Об'єднаний рядок:", resultMemo);
