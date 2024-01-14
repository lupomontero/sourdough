const createElement = (tag, props = {}, ...children) => {
  const element = document.createElement(tag);

  Object.keys(props).forEach(key => element[key] = props[key]);

  if (children.length > 0) {
    children.forEach(child => {
      if (typeof child === 'string') {
        child = document.createTextNode(child);
      }

      element.appendChild(child);
    });
  }

  return element;
};

const computeBakersPercentage = (flourAmount, bakersPercentage) => {
  const ingredients = Object.keys(bakersPercentage);

  return ingredients.reduce((acc, ingredient) => {
    const ingredientAmount = flourAmount * (bakersPercentage[ingredient] / 100);
    acc[ingredient] = ingredientAmount;
    return acc;
  }, {});
};

const flours = [
  // {
  //   name: 'Bread flour',
  //   protein: 12.7,
  // },
  {
    name: 'All purpose flour',
    protein: 11.7,
  },
  {
    name: 'Whole wheat flour',
    protein: 14.0,
  },
  // {
  //   name: 'Rye flour',
  //   protein: 7.0,
  // },
];

const recipes = [
  {
    name: 'Sourdough bread',
    bakersPercentage: {
      flour: 100,
      water: 77,
      starter: 20,
      salt: 2,
    },
  },
  {
    name: 'Sourdough Pizza bread',
    bakersPercentage: {
      flour: 100,
      water: 65,
      starter: 20,
      salt: 3,
    },
  },
  // {
  //   name: 'Sourdough French baguette',
  // },
  // {
  //   name: 'Sourdough Bagels',
  // },
];

const RecipesSelect = ({ recipes }) => createElement(
  'select',
  { id: 'recipes-select' },
  ...recipes.map(recipe => {
    const { name } = recipe;
    return createElement('option', {
      value: name,
    }, name);
  }),
);

const FlourAmountInput = ({ flourAmount }) => {
  const container = createElement('div', { id: 'flour-amount-input' });
  const label = createElement('label', {}, 'Flour amount');
  const input = createElement('input', {
    type: 'number',
    value: flourAmount,
  });

  container.appendChild(label);
  container.appendChild(input);

  return container;
};

const IngredientsList = ({ ingredients }) => {
  const list = createElement(
    'ul',
    { id: 'ingredients' },
    ...Object.keys(ingredients).map(key => {
      return createElement('li', {}, `${key}: ${ingredients[key]}g`);
    }),
  );

  return list;
};

const main = () => {
  const state = {
    recipe: recipes[0],
    flourAmount: 600,
    ingredients: computeBakersPercentage(600, recipes[0].bakersPercentage),
  };

  const root = document.getElementById('root');
  const recipesSelect = RecipesSelect({ recipes });
  const flourAmountInput = FlourAmountInput({ flourAmount: state.flourAmount });

  const updateIngredientsList = () => {
    const prev = root.querySelector('#ingredients');
    if (prev) {
      prev.remove();
    }
    root.appendChild(IngredientsList({ ingredients: state.ingredients }));
  };

  recipesSelect.addEventListener('change', (event) => {
    const { value } = event.target;
    const recipe = recipes.find(recipe => recipe.name === value);
    Object.assign(state, {
      recipe,
      ingredients: computeBakersPercentage(state.flourAmount, recipe.bakersPercentage),
    });
    updateIngredientsList();
  });

  flourAmountInput.querySelector('input').addEventListener('change', (event) => {
    const { value } = event.target;
    const flourAmount = parseInt(value, 10);
    const { bakersPercentage } = state.recipe;
    Object.assign(state, {
      flourAmount,
      ingredients: computeBakersPercentage(flourAmount, bakersPercentage),
    });
    updateIngredientsList();
  });

  root.appendChild(recipesSelect);
  root.appendChild(flourAmountInput);

  updateIngredientsList();
};

window.addEventListener('load', main);
