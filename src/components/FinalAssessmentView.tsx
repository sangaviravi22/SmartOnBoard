import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, AlertCircle, Award, Download } from "lucide-react";
import { FinalAssessmentQuestion, FinalAssessmentResult, Certificate, UserProfile, SkillLevel } from "../types";
import { geminiService } from "../services/geminiService";

interface FinalAssessmentViewProps {
  userProfile: UserProfile;
  skillLevel: SkillLevel;
  onComplete: (certificate: Certificate | null) => void;
}

export default function FinalAssessmentView({
  userProfile,
  skillLevel,
  onComplete
}: FinalAssessmentViewProps) {
  const [questions, setQuestions] = useState<FinalAssessmentQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; answerIndex: number; correct: boolean }[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<FinalAssessmentResult | null>(null);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const maxAttempts = 3;
  const [testStarted, setTestStarted] = useState(false);

  const startTest = async () => {
    if (attemptCount >= maxAttempts) {
      alert(`You have exhausted all ${maxAttempts} attempts. Please contact support.`);
      return;
    }

    setLoading(true);
    try {
      const generatedQuestions = await geminiService.generateFinalAssessment(userProfile, skillLevel);
      setQuestions(generatedQuestions);
      setTestStarted(true);
      setAnswers([]);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setAttemptCount(attemptCount + 1);
    } catch (error) {
      console.error("Error generating final assessment:", error);
      alert("Failed to generate assessment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswer(optionIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) {
      alert("Please select an answer before submitting.");
      return;
    }

    const question = questions[currentQuestion];
    const isCorrect = selectedAnswer === question.correctAnswer;

    setAnswers([
      ...answers,
      {
        questionId: question.id,
        answerIndex: selectedAnswer,
        correct: isCorrect
      }
    ]);

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      submitTest();
    }
  };

  const submitTest = async () => {
    setLoading(true);
    try {
      const { result, certificate: generatedCert } = await geminiService.evaluateFinalAssessment(
        userProfile,
        answers,
        skillLevel
      );

      setAssessmentResult(result);
      if (generatedCert) {
        setCertificate(generatedCert);
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
      alert("Error submitting assessment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = () => {
    if (!certificate) return;

    const certificateContent = `
================================================================================
                          COURSE COMPLETION CERTIFICATE
================================================================================

This certifies that:

                            ${certificate.userName}
                         (${certificate.userEmail})

Has successfully completed the course:

                    ${certificate.courseName}

At the ${certificate.skillLevel} Level

With a Final Score of: ${certificate.finalScore}/${assessmentResult?.maxScore || 10} (${certificate.percentage}%)

Completion Date: ${certificate.completionDate}
Certificate ID: ${certificate.certificateId}
Issued Date: ${certificate.issueDate}

================================================================================
                        This certificate validates the holder's
                    commitment to professional development and skill
                    mastery in the subject matter covered by this course.
================================================================================
    `;

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(certificateContent));
    element.setAttribute("download", `Certificate_${certificate.certificateId}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleComplete = () => {
    onComplete(certificate);
  };

  if (assessmentResult) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
      >
        {assessmentResult.passed && certificate ? (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <Award className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-green-600 mb-4">Congratulations! 🎉</h2>
            <p className="text-xl text-gray-600 mb-8">{assessmentResult.feedback}</p>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg mb-8 border-2 border-green-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Achievement</h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-gray-600 text-sm mb-2">Final Score</p>
                  <p className="text-3xl font-bold text-green-600">
                    {certificate.finalScore}/{assessmentResult.maxScore}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-gray-600 text-sm mb-2">Percentage</p>
                  <p className="text-3xl font-bold text-blue-600">{certificate.percentage}%</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow mb-6">
                <p className="text-gray-600 text-sm mb-2">Skill Level Achieved</p>
                <p className="text-2xl font-bold text-purple-600">{certificate.skillLevel}</p>
              </div>

              <div className="text-left bg-white p-4 rounded-lg shadow">
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Certificate ID:</span> {certificate.certificateId}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Issued:</span> {certificate.issueDate}
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={downloadCertificate}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                <Download className="w-5 h-5" />
                Download Certificate
              </button>

              <button
                onClick={handleComplete}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Continue
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <AlertCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-red-600 mb-4">Not Yet!</h2>
            <p className="text-xl text-gray-600 mb-8">{assessmentResult.feedback}</p>

            <div className="bg-red-50 p-6 rounded-lg mb-8 border-2 border-red-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Score</h3>
              <p className="text-4xl font-bold text-red-600 mb-4">
                {assessmentResult.score}/{assessmentResult.maxScore} ({assessmentResult.percentage}%)
              </p>
              <p className="text-gray-700 mb-6">
                You need 70% to pass. You have <span className="font-bold">{maxAttempts - attemptCount}</span> more attempt(s).
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              {attemptCount < maxAttempts ? (
                <button
                  onClick={startTest}
                  disabled={loading}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50"
                >
                  {loading ? "Preparing..." : "Try Again"}
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-red-600 font-semibold mb-4">
                    You have exhausted all {maxAttempts} attempts. Please contact support.
                  </p>
                  <button
                    onClick={handleComplete}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Go Back
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  }

  if (!testStarted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg"
      >
        <div className="text-center">
          <Award className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Final Assessment</h2>

          <div className="bg-blue-50 p-6 rounded-lg mb-8 border-2 border-blue-200">
            <p className="text-gray-700 mb-4">
              You've completed all 30 days of learning! Now it's time to take the final comprehensive assessment.
            </p>
            <ul className="text-left text-gray-700 space-y-2 mb-6">
              <li>✓ 10 comprehensive questions covering all course material</li>
              <li>✓ Mix of fundamental, intermediate, and advanced topics</li>
              <li>✓ You have <span className="font-bold">{maxAttempts}</span> attempts to pass (70% required)</li>
              <li>✓ Certificate issued upon successful completion</li>
            </ul>
          </div>

          <button
            onClick={startTest}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Preparing Test..." : "Start Final Assessment"}
          </button>
        </div>
      </motion.div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <p className="text-gray-600">Loading questions...</p>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const currentAnswer = answers.find(a => a.questionId === question.id);
  const isAnswered = currentAnswer !== undefined;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Question {currentQuestion + 1} of {questions.length}
          </h3>
          <span className="text-sm text-gray-600">
            Attempt {attemptCount} of {maxAttempts}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-xl font-semibold text-gray-800 mb-6">{question.question}</h4>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-left rounded-lg border-2 transition ${
                selectedAnswer === index
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              } ${showFeedback && index === question.correctAnswer ? "border-green-500 bg-green-50" : ""} ${
                showFeedback && index === currentAnswer?.answerIndex && !currentAnswer?.correct
                  ? "border-red-500 bg-red-50"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-800">{option}</span>
                {showFeedback && index === question.correctAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
                {showFeedback && index === currentAnswer?.answerIndex && !currentAnswer?.correct && (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg mb-6 ${
            currentAnswer?.correct ? "bg-green-50 border-l-4 border-green-500" : "bg-red-50 border-l-4 border-red-500"
          }`}
        >
          <p className={`font-semibold mb-2 ${currentAnswer?.correct ? "text-green-700" : "text-red-700"}`}>
            {currentAnswer?.correct ? "Correct!" : "Incorrect"}
          </p>
          <p className="text-gray-700">{question.explanation}</p>
        </motion.div>
      )}

      <div className="flex gap-4">
        {!showFeedback ? (
          <button
            onClick={handleSubmitAnswer}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {currentQuestion === questions.length - 1 ? "Finish Assessment" : "Next Question"}
          </button>
        )}
      </div>
    </motion.div>
  );
}
