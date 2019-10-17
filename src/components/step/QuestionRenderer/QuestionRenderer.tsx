import React, { forwardRef, FunctionComponent, RefObject } from 'react';
import { StyleSheet, TextInput as TextInputStatic } from 'react-native';
import { DefaultTheme, TextInput } from 'react-native-paper';
import { material } from 'react-native-typography';
import { translate } from '../../../localization/locale';
import { Question } from '../../../models/quest';
import { Colors } from '../../../styles/colors';
import { QuestContext } from '../../QuestionContainer/QuestionContainer';

interface IQuestionRendererProps {
  question: Question;
  ref?: RefObject<TextInputStatic>;
}

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
                onChangeText={answer => context.setText(answer)}
                value={context.text}
                mode="outlined"
                style={styles.answerInput}
                placeholder={translate('type_answer')}
                theme={{
                  ...DefaultTheme,
                  colors: {
                    ...DefaultTheme.colors,
                    primary: Colors.WHITE,
                    accent: Colors.WHITE_048,
                    background: 'transparent',
                    text: Colors.WHITE,
                    placeholder: Colors.WHITE_048
                  }
                }}
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
                onChangeText={answer => context.setText(answer)}
                value={context.text}
                mode="outlined"
                keyboardType="number-pad"
                style={styles.answerInput}
                placeholder={translate('type_answer')}
                theme={{
                  ...DefaultTheme,
                  colors: {
                    ...DefaultTheme.colors,
                    primary: Colors.WHITE,
                    accent: Colors.WHITE_048,
                    background: 'transparent',
                    text: Colors.WHITE,
                    placeholder: Colors.WHITE_048
                  }
                }}
              />
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
  }
});

export default QuestionRenderer;
