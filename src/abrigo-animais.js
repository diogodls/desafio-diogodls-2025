class Animals {
  animals = [
    {
      name: 'Rex',
      specie: 'cão',
      favoriteToys: ['RATO', 'BOLA']
    },
    {
      name: 'Mimi',
      specie: 'gato',
      favoriteToys: ['BOLA', 'LASER']
    },
    {
      name: 'Fofo',
      specie: 'gato',
      favoriteToys: ['BOLA', 'RATO', 'LASER']
    },
    {
      name: 'Zero',
      specie: 'gato',
      favoriteToys: ['RATO', 'BOLA']
    },
    {
      name: 'Bola',
      specie: 'cão',
      favoriteToys: ['CAIXA', 'NOVELO']
    },
    {
      name: 'Bebe',
      specie: 'cão',
      favoriteToys: ['LASER', 'RATO', 'BOLA']
    },
    {
      name: 'Loco',
      specie: 'jabuti',
      favoriteToys: ['SKATE', 'RATO']
    },
  ];

  VALID_TOYS = ['LASER', 'RATO', 'BOLA', 'SKATE', 'NOVELO', 'CAIXA'];
}

class AbrigoAnimais {
  verifyToysOrder(animalToys, personToys) {
    const isLoco = animalToys.length === 2 &&
      animalToys.includes('SKATE') &&
      animalToys.includes('RATO');

    if (isLoco) {
      return personToys.includes('SKATE') && personToys.includes('RATO');
    }

    let i = 0;
    for (const toy of personToys) {
      if (toy === animalToys[i]) {
        i++;
      }
      if (i === animalToys.length) return true;
    }
    return false;
  };

  verifyAnimalQuantity(animals) { //Uma pessoa não pode levar mais de três animais para casa
    if (animals.length >= 3) {
      return animals.slice(0, 3);
    }

    return animals;
  };

  verifyEqualAnimals(animalsPerson1, animalsPerson2) { //Se ambas as pessoas tiverem condições de adoção, ninguém fica com o animal (tadinho)
    const onlyPerson1Animals = [];
    const onlyPerson2Animals = [];

    animalsPerson1.forEach((a) => {
      const match = animalsPerson2.find((b) => b.name === a.name);
      if (!match) {
        onlyPerson1Animals.push(a);
      }
    });

    animalsPerson2.forEach((a) => {
      const match = animalsPerson1.find((b) => b.name === a.name);
      if (!match) {
        onlyPerson2Animals.push(a);
      }
    });

    return [onlyPerson1Animals, onlyPerson2Animals];
  }

  verifyLoco(animals) { //Loco não se importa com a ordem dos seus brinquedos desde que tenha outro animal como companhia
    animals = animals.filter((animal) => {
      if (animal.name === 'Loco') {
        if (animals.length <= 1) {
          return false;
        }
      }
      return true;
    });

    return animals;
  }

  verifyInvalidAnimals(animals, animalsOrder) {
    const validNames = new Set(animals.map(a => a.name.trim()));
    const normalized = animalsOrder.map(animal => animal.trim());

    const hasDuplicates = new Set(normalized).size !== normalized.length;
    const allValid = normalized.every(animal => validNames.has(animal));

    return hasDuplicates || !allValid;
  }

  verifyInvalidToys(VALID_TOYS, personToys) {
    const normalized = personToys.map(personToy => personToy.trim());

    const hasDuplicates = new Set(normalized).size !== normalized.length;
    const allValid = normalized.every(toy => VALID_TOYS.includes(toy));

    return hasDuplicates || !allValid;
  }

  showAdoptedAnimals(animalsPerson1, animalsPerson2, animalsOrder) {
    animalsPerson1 = animalsPerson1.map((animal) => animal.name);
    animalsPerson2 = animalsPerson2.map((animal) => animal.name);

    const finalAnimals = animalsOrder.map((animal) => {
      if (animalsPerson1.includes(animal)) return `${animal} - pessoa 1`;
      else if (animalsPerson2.includes(animal)) return `${animal} - pessoa 2`;
      return `${animal} - abrigo`;
    }).sort();

    return {
      lista: finalAnimals,
    };
  }

  encontraPessoas(toysPerson1, toysPerson2, animalsOrder) {
    toysPerson1 = toysPerson1.split(',').map((i) => i.trim());
    toysPerson2 = toysPerson2.split(',').map((i) => i.trim());
    animalsOrder = animalsOrder.split(',').map((i) => i.trim());
    const animals = new Animals();

    if (this.verifyInvalidAnimals(animals.animals, animalsOrder)) {
      return { erro: 'Animal inválido' };
    }

    if (this.verifyInvalidToys(animals.VALID_TOYS, toysPerson1) || this.verifyInvalidToys(animals.VALID_TOYS, toysPerson2)) {
      return { erro: 'Brinquedo inválido' };
    }

    const requiredAnimals = animals.animals.filter((animal) => animalsOrder.includes(animal.name));

    let animalsPerson1 = requiredAnimals.filter((animal) =>
      this.verifyToysOrder(animal.favoriteToys, toysPerson1)
    );
    let animalsPerson2 = requiredAnimals.filter((animal) =>
      this.verifyToysOrder(animal.favoriteToys, toysPerson2)
    );

    animalsPerson1 = this.verifyAnimalQuantity(animalsPerson1);
    animalsPerson2 = this.verifyAnimalQuantity(animalsPerson2);

    animalsPerson1 = this.verifyLoco(animalsPerson1);
    animalsPerson2 = this.verifyLoco(animalsPerson2);

    [animalsPerson1, animalsPerson2] = this.verifyEqualAnimals(animalsPerson1, animalsPerson2);

    return this.showAdoptedAnimals(animalsPerson1, animalsPerson2, animalsOrder);
  };
}

export { AbrigoAnimais as AbrigoAnimais };