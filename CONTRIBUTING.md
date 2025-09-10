# Contribution Guidelines

Thank you for considering contributing to our project! To ensure a smooth process, please follow the guidelines below.

## How to Contribute

1. **Fork the Repository**: 
   - Create a personal copy of the repository by forking it.

2. **Clone the Repository**: 
   - Clone your fork to your local machine:
     ```bash
     git clone https://github.com/your-username/my-boilerplate.git
     ```

3. **Create a Feature Branch**: 
   - Create a new branch for your feature or bug fix:
     ```bash
     git checkout -b feature/my-feature
     ```

4. **Make Your Changes**: 
   - Implement your feature or fix the bug.

5. **Document Use Cases**:
   - For every new feature or use case, please document it in the `docs/use_cases` directory.
   - Use the provided template for documentation to ensure consistency.

6. **Run Tests**: 
   - Ensure that all tests pass before submitting your changes.

7. **Commit Your Changes**: 
   - Write clear and concise commit messages:
     ```bash
     git commit -m "Add feature: describe the feature"
     ```

8. **Push to Your Fork**: 
   - Push your changes to your forked repository:
     ```bash
     git push origin feature/my-feature
     ```

9. **Create a Pull Request**: 
   - Go to the original repository and create a pull request from your feature branch.

## Code Style

- Please follow the existing code style and conventions in the project.
- Use ESLint and Prettier to ensure code quality and formatting.

## Documentation

- All new features must have corresponding documentation in the `docs/use_cases` directory.
- If you create a new use case, please ensure that it is documented using the provided templates.

## Issues

- If you encounter any issues or have questions, feel free to open an issue in the repository.

Thank you for contributing!


SOLID: 

S: (Single Responsibility Principle)
Ce principe stipule qu'un module/une classe/une fonction ne doit avoir qu'une seule responsabilité et qu'une seule raison de changer. Par exemple, nous pouvons également utiliser des hooks personnalisés pour encapsuler la logique de récupération des données, de gestion de l'état ou d'exécution des effets secondaires.

Par exemple, si nous avons une page/un composant pour restituer une liste de plannings, toutes les tâches non liées comme la récupération de données à partir du serveur doivent être gérées par un autre module.


En séparant les préoccupations des différents modules, nous pouvons éviter les problèmes de couplage et de dépendance qui peuvent survenir lors de la modification ou de l'ajout de nouvelles fonctionnalités.


ex: 
// src/hooks/useDataSchedule.ts
export const useDataSchedule = () => {
  const fetcher = (url: string) =>
    fetch(process.env.NEXT_PUBLIC_API_URL + url).then((res) => (res.json()));

  const { data, error, isLoading, mutate } = useSWR<TSchedule[], Error>(
    '/api/schedule/list/',
    fetcher
  );
  return {
    data,
    error,
    isLoading,
    mutate,
  };
}


// src/components/schedule/ScheduleList.tsx
const ScheduleList = () => {
  // We call the hook and retrieve the Schedule
  const { data, error, isLoading, mutate } = useDataSchedule();
  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>
  return (
 <div>
     <h1>Schedule List:</h1>
     <ul>
      {data?.map((schedule) => (
        <li key={schedule.id}>
          <h2>{schedule.name}</h2>
          <ScheduleDetail title={schedule.detail.title}
          startTime={schedule.detail.start_time}
          endTime={schedule.detail.end_time} />
        </li>
      ))}
     </ul>
</div>
  );
};

O (Open Closed Principle)
Une classe ou un module doit être ouvert à l'extension, mais fermé à la modification. Cela signifie que nous devons pouvoir ajouter de nouvelles fonctionnalités ou de nouveaux comportements sans modifier le code existant. Ce principe peut être respecté lorsque nous créons des composants réutilisables pour notre projet.



// src/components/common/CustomButton.tsx

// Interface for the props of the button component
interface CustomButtonProps {
  text: string;
  className: string;
  onClick: () => void;
};

// A button component that takes a string and applies a tailwind class to the button element
export const CustomButton: React.FC<ColorButtonProps> = ({ text, className, onClick }) => {

  return (
    <button
      type="button"
      className={`text-white font-bold py-2 px-4 rounded ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
//src/components/modules/LoginModule/buttons.tsx
import { CustomButton } from '@components/common'

export const LandingPageModule = () => {
    return (
<div className="flex flex-col">
<CustomButton text="Login" className="bg-green" />
<CustomButton text="Create account" className="bg-gray" />
</div>
    )
}


Principe de substitution de Liskov
Une sous-classe ou un sous-composant doit pouvoir remplacer sa superclasse ou son supercomposant sans interrompre la fonctionnalité. Cela signifie que nous devons suivre le contrat ou l'interface défini par la classe ou le composant parent. L'explication peut sembler beaucoup plus difficile que la mise en œuvre.

Nous pouvons modifier l'exemple précédent pour adhérer au principe de substitution de Liskov.



Step: 

- Create schema
- Create types