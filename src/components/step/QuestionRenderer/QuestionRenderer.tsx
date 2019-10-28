import React, { forwardRef, FunctionComponent, RefObject } from 'react';
import { Dimensions, StyleSheet, Text, TextInput as TextInputStatic, View } from 'react-native';
import { DefaultTheme, RadioButton, TextInput } from 'react-native-paper';
import { material } from 'react-native-typography';
import { translate } from '../../../localization/locale';
import { QuestionMetadata } from '../../../models/quest';
import { Colors } from '../../../styles/colors';
import { QuestContext } from '../../QuestionContainer/QuestionContainer';

interface IQuestionRendererProps {
  question: QuestionMetadata;
  ref?: RefObject<TextInputStatic>;
}

const TEXT_INPUT_THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.WHITE,
    accent: Colors.WHITE_048,
    background: 'transparent',
    text: Colors.WHITE,
    placeholder: Colors.WHITE_048
  }
};

const QuestionRenderer: FunctionComponent<IQuestionRendererProps> = forwardRef(
  (props: IQuestionRendererProps, ref: RefObject<TextInputStatic>) => {
    const { question } = props;

    switch (question.kind) {
      case 'text':
        return (
          <QuestContext.Consumer>
            {context => (
              <TextInput
                ref={ref}
                onChangeText={answer => context.setAnswer(answer)}
                value={context.answer}
                mode="outlined"
                style={styles.answerInput}
                placeholder={translate('type_answer')}
                theme={TEXT_INPUT_THEME}
              />
            )}
          </QuestContext.Consumer>
        );
      case 'number':
        return (
          <QuestContext.Consumer>
            {context => (
              <TextInput
                ref={ref}
                onChangeText={answer => context.setAnswer(answer)}
                value={context.answer}
                mode="outlined"
                keyboardType="number-pad"
                style={styles.answerInput}
                placeholder={translate('type_answer')}
                theme={TEXT_INPUT_THEME}
              />
            )}
          </QuestContext.Consumer>
        );
      case 'single':
        return (
          <QuestContext.Consumer>
            {context => (
              <View style={{ marginVertical: 12 }}>
                <RadioButton.Group onValueChange={value => context.setAnswer(value)} value={context.answer}>
                  {question.options.map((opt, index) => (
                    <View key={index}>
                      <View style={styles.optionLabelContainer}>
                        <Text style={[material.subheading, { color: Colors.WHITE }]}>{opt}</Text>
                      </View>
                      <View style={styles.optionRadioButton}>
                        <RadioButton value={opt} uncheckedColor={Colors.GRAY_500} color={Colors.WHITE} />
                      </View>
                    </View>
                  ))}
                </RadioButton.Group>
              </View>
            )}
          </QuestContext.Consumer>
        );
    }
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
  },
  optionLabelContainer: {
    marginStart: 56,
    width: Dimensions.get('window').width - 56,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: Colors.WHITE_016
  },
  optionRadioButton: { position: 'absolute', width: '100%', paddingTop: 6 }
});

export default QuestionRenderer;
