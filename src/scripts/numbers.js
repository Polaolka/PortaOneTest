// const numbers = [
//   '942517',
//   '605676',
//   '498291',
//   '668826',
//   '357057',
//   '478151',
//   '315629',
//   '007148',
//   '252887',
//   '421662',
//   '284505',
//   '467650',
//   '115330',
//   '648206',
//   '207562',
//   '612298',
//   '576885',
//   '294200',
//   '847595',
//   '021597',
//   '074878',
//   '801997',
//   '585401',
//   '168510',
//   '385293',
//   '151863',
//   '022142',
//   '340350',
//   '976151',
//   '337989',
//   '863284',
//   '488310',
//   '303887',
//   '939173',
//   '331413',
//   '905657',
//   '833617',
//   '170794',
//   '094486',
//   '551394',
//   '943693',
//   '147970',
//   '400196',
//   '537505',
//   '367493',
//   '117178',
//   '675840',
//   '868721',
//   '519081',
//   '735564',
//   '401733',
//   '915348',
//   '169233',
//   '324651',
//   '958675',
//   '368753',
//   '861460',
//   '401341',
//   '343222',
//   '794373',
//   '816374',
//   '535119',
//   '188234',
//   '577779',
//   '097792',
//   '729303',
//   '782637',
//   '148159',
//   '830641',
//   '716890',
//   '397853',
//   '871196',
//   '277603',
//   '749226',
//   '839595',
//   '131852',
//   '409432',
//   '810698',
//   '456030',
//   '529185',
//   '758823',
//   '265024',
//   '051041',
//   '699031',
//   '737269',
//   '139340',
//   '730977',
//   '249786',
//   '039931',
//   '055669',
//   '100107',
//   '653178',
//   '279773',
//   '336550',
//   '332847',
//   '685485',
//   '423269',
//   '193536',
//   '890062',
//   '377637',
//   '595777',
//   '412134',
//   '322736',
//   '546929',
//   '616370',
//   '767332',
//   '781184',
//   '920944',
//   '851005',
//   '258850',
//   '064083',
//   '051202',
//   '427711',
//   '359855',
//   '540928',
//   '314284',
//   '085261',
//   '880969',
//   '649699',
//   '064881',
//   '705423',
//   '646927',
//   '252556',
//   '272007',
//   '217511',
//   '620286',
//   '229724',
//   '108865',
//   '124636',
//   '231417',
//   '961201',
//   '658432',
//   '775416',
//   '246027',
//   '854036',
//   '687762',
//   '389097',
//   '013153',
//   '417085',
//   '919198',
//   '988711',
//   '488665',
// ];

document.getElementById('fileInput').addEventListener('change', handleFile);

function handleFile(event) {
  const file = event.target.files[0];
  if (!file) {
    alert('Будь ласка, виберіть файл.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const content = e.target.result;
    const numbers = content
      .split(/[\s,]+/)
      .filter(Boolean)
      .filter(str => /^\d+$/.test(str));
    // console.log('numbers', numbers);

    const result = dfsWithStack(numbers);

    console.log('result', result);

    // document.getElementById('result').textContent = `Результат: ${result}`;
  };
  reader.readAsText(file);
}

// function solvePuzzle(numbers) {
//   // Створити граф, де вершинами є числа, а ребрами — можливі переходи (за правилами пазлу).
//   const edges = new Map();
//   for (const num1 of numbers) {
//     // Отримуємо суфікс поточного числа
//     const suffix = num1.slice(-2);

//     for (const num2 of numbers) {
//       // Отримуємо префікс іншого числа
//       const prefix = num2.slice(0, 2);

//       // Додаємо ребро, якщо суфікс дорівнює префіксу
//       if (suffix === prefix && num1 !== num2) {
//         if (!edges.has(num1)) {
//           edges.set(num1, []);
//         }
//         edges.get(num1).push(num2);
//       }
//     }
//   }
//   console.log('map', edges);
// }

// function findStartingNumbers(numbers) {
//   const prefixes = numbers.map(num => num.slice(0, 2)); // Перші дві цифри
//   const suffixes = numbers.map(num => num.slice(-2)); // Останні дві цифри

//   // Знайдемо числа, у яких перші дві цифри не збігаються з жодним суфіксом
//   const startingNumbers = numbers.filter((num, index) => {
//     const prefix = prefixes[index];
//     return !suffixes.some((suffix, i) => suffix === prefix && i !== index);
//   });

//   return startingNumbers;
// }

function solvePuzzle(numbers) {
  const graph = new Map();
  const memo = new Map(); // Для збереження результатів
  const maxDepth = 150; // Обмеження на максимальну глибину BFS

  // Побудова графа
  for (const num of numbers) {
    const suffix = num.slice(-2);
    if (!graph.has(suffix)) {
      graph.set(suffix, []);
    }
    graph.get(suffix).push(num);
  }

  // BFS з обмеженням глибини
  function findLongestChainBFS(start) {
    if (memo.has(start)) return memo.get(start);

    const queue = [[start, [start]]];
    let longestChain = [];

    while (queue.length > 0) {
      const [current, chain] = queue.shift();
      const suffix = current.slice(-2);
      const nextNumbers = graph.get(suffix) || [];

      // Оновлення найдовшого ланцюжка
      if (chain.join('').length > longestChain.join('').length) {
        longestChain = chain;
      }

      // Якщо досягли максимального рівня глибини, припиняємо пошук
      if (chain.length >= maxDepth) continue;

      for (const next of nextNumbers) {
        if (!chain.includes(next)) {
          // Уникаємо циклів
          queue.push([next, [...chain, next]]);
        }
      }
    }

    // Збереження результату в мемо
    memo.set(start, longestChain);
    return longestChain;
  }

  // Перевірка всіх стартових чисел
  let longestChainOverall = [];
  for (const start of numbers) {
    const chain = findLongestChainBFS(start);
    if (chain.join('').length > longestChainOverall.join('').length) {
      longestChainOverall = chain;
    }
  }

  return longestChainOverall.join('');
}

function dfsWithStack(numbers) {
  const graph = buildGraph(numbers); // Побудова графа
  console.log('graph', graph);

  let longestChain = []; // Найдовший ланцюжок

  // Ітеративний DFS для кожного стартового числа
  numbers.forEach(start => {
    const stack = [[start, [start]]]; // Стек: [поточне число, поточний ланцюжок]

    while (stack.length > 0) {
      const [current, chain] = stack.pop();
      const suffix = current.slice(-2); // Останні дві цифри
      const nextNumbers = graph[suffix] || [];

      // Якщо цей шлях довший за поточний найдовший, оновлюємо його
      if (chain.length > longestChain.length) {
        longestChain = chain;
      }

      nextNumbers.forEach(nextNum => {
        if (!chain.includes(nextNum)) {
          // Уникнення циклів
          stack.push([nextNum, [...chain, nextNum]]);
        }
      });
    }
  });

  return longestChain;
}

// Функція для побудови графа
function buildGraph(numbers) {
  const graph = {};
  numbers.forEach(num => {
    const suffix = num.slice(-2); // Останні дві цифри
    if (!graph[suffix]) {
      graph[suffix] = [];
    }
    graph[suffix].push(num);
  });
  return graph;
}
