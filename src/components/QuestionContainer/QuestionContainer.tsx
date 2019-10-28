import React, { forwardRef, FunctionComponent, RefObject, useEffect, useState } from 'react';
import { Dimensions, Keyboard, StyleSheet, Text, TextInput as TextInputStatic, View } from 'react-native';
import { useKeyboard } from 'react-native-hooks';
import { Button } from 'react-native-paper';
import { material } from 'react-native-typography';
import { translate } from '../../localization/locale';
import { QuestionMetadata, QuestStep } from '../../models/quest';
import { Colors } from '../../styles/colors';
import { QuestionRenderer } from '../step/QuestionRenderer';

interface IQuestionContainerProps {
  step: QuestStep;
  onCorrectAnswer: (step: QuestStep) => void;
  onSkipQuestionPressed: (step: QuestStep) => void;
  ref?: RefObject<TextInputStatic>;
}

type QuestionContext = {
  answer: string;
  setAnswer?: (answer: string) => void;
};

export const QuestContext = React.createContext<QuestionContext>({
  answer: ''
});

const QuestionContainer: FunctionComponent<IQuestionContainerProps> = forwardRef(
  ({ step, onCorrectAnswer, onSkipQuestionPressed }, ref: RefObject<TextInputStatic>) => {
    const { isKeyboardShow } = useKeyboard();
    const [data, setData] = useState({
      text: ''
    });
    const [isCorrect, setCorrect] = useState(false);

    const question: QuestionMetadata = JSON.parse(step.properties);

    useEffect(() => {
      if (!isKeyboardShow && isCorrect) {
        onCorrectAnswer(step);
        clearState();
      }
    }, [isKeyboardShow]);

    const onAnswerPressed = () => {
      const isValid = data.text === question.answer;
      
      if (isKeyboardShow) {
        setCorrect(isValid);
        Keyboard.dismiss();
      } else if (isValid) {
        onCorrectAnswer(step);
        clearState();
      }
    };

    const onSkipPressed = () => {
      onSkipQuestionPressed(step);
    };

    const clearState = () => {
      setData({
        text: ''
      });
    };

    return (
      <View style={{ width: Dimensions.get('window').width - 32 }}>
        <QuestContext.Provider
          value={{
            answer: data.text,
            setAnswer: (text: string) => {
              setCorrect(false);
              setData({
                ...data,
                text
              });
            }
          }}
        >
          <Text style={styles.question}>{`${step.quest_index}. ${question.question}`}</Text>
          <QuestionRenderer ref={ref} question={question} />
          <Button onPress={onAnswerPressed} mode="contained" dark={true}>
            {translate('answer')}
          </Button>
          <Button
            onPress={onSkipPressed}
            mode="text"
            dark={true}
            theme={{
              colors: {
                primary: Colors.WHITE
              }
            }}
            style={{ marginTop: 12 }}
          >
            {translate('skip_question')}
          </Button>
        </QuestContext.Provider>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  question: {
    ...material.titleObject,
    color: Colors.WHITE
  },
  answerInput: {
    width: '100%',
    marginVertical: 12
  }
});

export default QuestionContainer;
