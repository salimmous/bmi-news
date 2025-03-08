export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">About BMI Tracker</h1>

      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">What is BMI?</h2>
        <p className="mb-4">
          Body Mass Index (BMI) is a value derived from the weight and height of
          a person. The BMI is defined as the body mass divided by the square of
          the body height, and is expressed in units of kg/m², resulting from
          mass in kilograms and height in meters.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">BMI Categories</h2>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            <strong>Underweight:</strong> BMI less than 18.5
          </li>
          <li className="mb-2">
            <strong>Normal weight:</strong> BMI between 18.5 and 24.9
          </li>
          <li className="mb-2">
            <strong>Overweight:</strong> BMI between 25 and 29.9
          </li>
          <li className="mb-2">
            <strong>Obesity:</strong> BMI of 30 or greater
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Limitations of BMI</h2>
        <p className="mb-4">
          While BMI can be a useful tool for identifying potential weight
          problems in adults, it has several limitations:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">
            It doesn't distinguish between muscle and fat
          </li>
          <li className="mb-2">It doesn't account for body composition</li>
          <li className="mb-2">
            It may not be accurate for athletes, elderly people, or pregnant
            women
          </li>
          <li className="mb-2">
            It doesn't consider where fat is stored in the body
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          About Our Application
        </h2>
        <p className="mb-4">
          The BMI Tracker is designed to help you monitor your Body Mass Index
          over time and provide personalized health recommendations based on
          your measurements. Our goal is to support your health journey by
          giving you the tools to track your progress and make informed
          decisions about your wellness.
        </p>
        <p className="mb-4">
          Remember that BMI is just one indicator of health, and it's always
          best to consult with healthcare professionals for personalized advice
          about your weight and health goals.
        </p>
      </div>
    </div>
  );
}
