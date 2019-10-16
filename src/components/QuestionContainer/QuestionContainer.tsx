import React, { forwardRef, FunctionComponent, useEffect, useState, useRef, Ref, RefObject } from 'react';
import { Keyboard, StyleSheet, Text, TextInput as TextInputStatic, View } from 'react-native';
import { useKeyboard } from 'react-native-hooks';
import { Button, DefaultTheme, TextInput } from 'react-native-paper';
import { material } from 'react-native-typography';
import { translate } from '../../localization/locale';
import { Question, QuestStep } from '../../models/quest';
import { Colors } from '../../styles/colors';
import { QuestionRenderer } from '../step/QuestionRenderer';

interface IQuestionContainerProps {
  step: QuestStep;
  onCorrectAnswer: (step: QuestStep) => void;
  onSkipQuestionPressed: (step: QuestStep) => void;
  ref?: RefObject<TextInputStatic>;
}

type QuestionContext = {
  text: string;
  setText?: (text: string) => void;
};

export const QuestContext = React.createContext<QuestionContext>({
  text: ''
});

const QuestionContainer: FunctionComponent<IQuestionContainerProps> = forwardRef(
  ({ step, onCorrectAnswer, onSkipQuestionPressed }, ref: RefObject<TextInputStatic>) => {
    const { isKeyboardShow } = useKeyboard();
    const [data, setData] = useState({
      text: ''
    });

    // if (step.type !== 'question') {
    //   return <></>;
    // }

    const question: Question = JSON.parse(step.properties);

    useEffect(() => {
      if (!isKeyboardShow && data.text === question.r) {
        onCorrectAnswer(step);
      }
    }, [isKeyboardShow]);

    const onAnswerPressed = () => {
      if (isKeyboardShow) {
        Keyboard.dismiss();
      } else {
        onCorrectAnswer(step);
      }
    };

    const onSkipPressed = () => {
      onSkipQuestionPressed(step);
    };

    return (
      <QuestContext.Provider
        value={{
          text: data.text,
          setText: (text: string) => {
            setData({
              ...data,
              text
            });
          }
        }}
      >
        <Text style={styles.question}>{`${step.quest_index}. ${question.q}`}</Text>
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
