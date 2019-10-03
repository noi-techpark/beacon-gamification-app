import React, { useState } from 'react';
import { Button, Keyboard, StyleSheet, Text, TextInput } from 'react-native';
import { translate } from '../../localization/locale';
import { Question } from '../../models/quest';
import { Colors } from '../../styles/colors';

const QuestStepQuestion = ({ step, onCorrectAnswer }) => {
  const [answer, setAnswer] = useState('');

  if (step.type !== 'question') {
    return <></>;
  }

  const question: Question = JSON.parse(step.properties);

  const onAnswerPressed = () => {
    Keyboard.dismiss();

    if (answer === question.r) {
      onCorrectAnswer(step);
    }
  };

  switch (question.kind) {
    case 'text':
      return (
        <>
          <Text>{question.q}</Text>
          <TextInput
            onChangeText={answer => setAnswer(answer)}
            value={answer}
            autoCapitalize="none"
            style={styles.answerInput}
            selectionColor={Colors.BLUE_500}
            underlineColorAndroid={Colors.BLUE_500}
          />
          <Button title={translate('answer')} onPress={onAnswerPressed} />
        </>
      );
    case 'number':
      return (
        <>
          <Text>{question.q}</Text>
          <TextInput
            onChangeText={answer => setAnswer(answer)}
            value={answer}
            keyboardType="number-pad"
            style={styles.answerInput}
            selectionColor={Colors.BLUE_500}
            underlineColorAndroid={Colors.BLUE_500}
          />
          <Button title={translate('answer')} onPress={onAnswerPressed} />
        </>
      );
  }
};

const styles = StyleSheet.create({
  answerInput: {
    height: 40,
    width: '100%',
    paddingHorizontal: 6,
    marginVertical: 16
  }
});

export default QuestStepQuestion;
