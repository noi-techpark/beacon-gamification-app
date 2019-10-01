import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput } from 'react-native';
import { translate } from '../../localization/locale';
import { Colors } from '../../styles/colors';

const QuestStepQuestion = ({ step, onCorrectAnswer }) => {
  const [answer, setAnswer] = useState('');

  function onAnswerPressed() {
    if (answer === JSON.parse(step.properties).r) {
      onCorrectAnswer(step);
    }
  }

  if (step.type === 'question') {
    return (
      <>
        <Text>{JSON.parse(step.properties).q}</Text>
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
  }

  return <></>;
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
