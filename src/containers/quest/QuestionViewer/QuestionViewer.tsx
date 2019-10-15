import React, { useEffect, useState } from 'react';
import { Image, Keyboard, StyleSheet, Text, TextInput } from 'react-native';
import { useKeyboard } from 'react-native-hooks';
import { Button } from 'react-native-paper';
import { useNavigationParam } from 'react-navigation-hooks';
import { translate } from '../../../localization/locale';
import { Question, QuestStep } from '../../../models/quest';
import { Colors } from '../../../styles/colors';

interface IQuestionViewerProps {
  // step: QuestStep;
  // onCorrectAnswer: (step: QuestStep) => void;
  // onSkipStepPressed: (step: QuestStep) => void;
}

const QuestionViewer: React.FunctionComponent<IQuestionViewerProps> = () => {
  const step: QuestStep = useNavigationParam('step');
  const onCorrectAnswer = useNavigationParam('onCorrectAnswer');
  const onSkipStepPressed = useNavigationParam('onSkipStepPressed');

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
          <Text>{question.q}</Text>
          <TextInput
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
          <Image
            source={
              step.id === 1
                ? {
                    uri:
                      'https://scontent-mxp1-1.xx.fbcdn.net/v/t1.0-9/60362028_10158533718775550_8803879888109961216_o.jpg?_nc_cat=104&_nc_oc=AQmQMfZctOTQtPwGgxzvFlkHScDy1Mm99JorANofezjCo3MOQwMURwXdBpSHB94ukCg&_nc_ht=scontent-mxp1-1.xx&oh=8eb016ce727d45adb0131a08ca6b06cc&oe=5E230089'
                  }
                : {
                    uri:
                      'https://static.wixstatic.com/media/9508b7_6810120813944ffb801e83ce6e4cca2a~mv2.jpg/v1/fill/w_3360,h_840,al_c,q_90,usm_0.66_1.00_0.01/9508b7_6810120813944ffb801e83ce6e4cca2a~mv2.jpg'
                  }
            }
            style={styles.absoluteFill}
            resizeMode="cover"
          />
          <Text>{question.q}</Text>
          <TextInput
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
};

const styles = StyleSheet.create({
  answerInput: {
    height: 40,
    width: '100%',
    paddingHorizontal: 6,
    marginVertical: 16
  },
  fill: {
    height: '100%',
    width: '100%'
  },
  absoluteFill: {
    height: '100%',
    width: '100%',
    position: 'absolute'
  }
});

export default QuestionViewer;
