import React, { forwardRef, FunctionComponent, useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput } from 'react-native';
import { useKeyboard } from 'react-native-hooks';
import { Button } from 'react-native-paper';
import { material } from 'react-native-typography';
import { translate } from '../../localization/locale';
import { Question, QuestStep } from '../../models/quest';
import { Colors } from '../../styles/colors';

interface IQuestStepQuestion {
  step: QuestStep;
  onCorrectAnswer: (step: QuestStep) => void;
  ref?: React.MutableRefObject<TextInput>;
}

const QuestStepQuestion: FunctionComponent<IQuestStepQuestion> = forwardRef(({ step, onCorrectAnswer }, ref) => {
  const [answer, setAnswer] = useState('');
  const { isKeyboardShow } = useKeyboard();

  if (step.type !== 'question') {
    return <></>;
  }

  const question: Question = JSON.parse(step.properties);

  useEffect(() => {
    if (!isKeyboardShow && answer === question.r) {
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

  switch (question.kind) {
    case 'text':
      return (
        <>
          <Text style={material.headlineWhite}>{question.q}</Text>
          <TextInput
            ref={ref}
            onChangeText={answer => setAnswer(answer)}
            value={answer}
            autoCapitalize="none"
            style={styles.answerInput}
            selectionColor={Colors.BLUE_500}
            underlineColorAndroid={Colors.BLUE_500}
          />
          <Button onPress={onAnswerPressed} mode="contained">
            {translate('answer')}
          </Button>
        </>
      );
    case 'number':
      return (
        <>
          <Text style={material.headlineWhite}>{question.q}</Text>
          <TextInput
            ref={ref}
            onChangeText={answer => setAnswer(answer)}
            value={answer}
            keyboardType="number-pad"
            style={styles.answerInput}
            selectionColor={Colors.BLUE_500}
            underlineColorAndroid={Colors.BLUE_500}
          />
          <Button onPress={onAnswerPressed} mode="contained">
            {translate('answer')}
          </Button>
        </>
      );
  }
});

const styles = StyleSheet.create({
  answerInput: {
    height: 40,
    width: '100%',
    paddingHorizontal: 6,
    marginVertical: 16
  }
});

export default QuestStepQuestion;
