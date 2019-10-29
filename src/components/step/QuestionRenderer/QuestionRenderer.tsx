import includes from 'lodash.includes';
import React, { forwardRef, FunctionComponent, RefObject } from 'react';
import { Dimensions, Image, StyleSheet, Text, TextInput as TextInputStatic, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { Checkbox, DefaultTheme, RadioButton, TextInput, TouchableRipple } from 'react-native-paper';
import { material } from 'react-native-typography';
import PlatformTouchable from '../../../common/PlatformTouchable/PlatformTouchable';
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
      case 'multiple':
        return (
          <QuestContext.Consumer>
            {context => (
              <View style={{ marginVertical: 12 }}>
                {question.options.map((opt, index) => (
                  <TouchableRipple key={index} onPress={() => context.toggleAnswer(opt)} rippleColor={Colors.WHITE}>
                    <>
                      <View style={styles.row}>
                        <View pointerEvents="none" style={styles.optionCheckBox}>
                          <Checkbox
                            status={includes(context.multipleAnswer, opt) ? 'checked' : 'unchecked'}
                            uncheckedColor={Colors.GRAY_500}
                            color={Colors.WHITE}
                          />
                        </View>
                        <Text style={[material.subheading, { color: Colors.WHITE, flex: 1, flexWrap: 'wrap' }]}>
                          {opt}
                        </Text>
                      </View>
                      <View style={styles.separator} />
                    </>
                  </TouchableRipple>
                ))}
              </View>
            )}
          </QuestContext.Consumer>
        );
      case 'order':
        return (
          <QuestContext.Consumer>
            {context => (
              <View style={{ flex: 1, marginVertical: 12 }}>
                <DraggableFlatList<string>
                  contentContainerStyle={{ height: ITEM_HEIGHT * question.options.length }}
                  keyExtractor={(item, _) => `draggable-item-${item}`}
                  data={context.orderedAnswer.length > 0 ? context.orderedAnswer : question.options}
                  renderItem={renderOrderOption}
                  onDragEnd={({ data }) => context.setOrderedAnswer(data)}
                  fixedOffset={ITEM_HEIGHT * question.options.length}
                />
              </View>
            )}
          </QuestContext.Consumer>
        );
    }

    function renderOrderOption(params: {
      item: unknown;
      index: number;
      drag: (index: number) => void;
      isActive: boolean;
    }) {
      return (
        <PlatformTouchable onLongPress={params.drag}>
          <View style={[styles.row, { height: ITEM_HEIGHT }, params.isActive && { backgroundColor: Colors.WHITE_012 }]}>
            <View style={styles.optionOrderIcon}>
              <Image source={require('../../../images/order_icon.png')} />
            </View>
            <Text style={[material.subheading, { color: Colors.WHITE, flex: 1, flexWrap: 'wrap' }]}>{params.item}</Text>
          </View>
          <View style={styles.separator} />
        </PlatformTouchable>
      );
    }
  }
);

const ITEM_HEIGHT = 48;

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
    paddingEnd: 12,
    width: Dimensions.get('window').width - 56,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: Colors.WHITE_016
  },
  optionRadioButton: { position: 'absolute', width: '100%', paddingTop: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginEnd: 16
  },
  optionCheckBox: {
    paddingStart: 4,
    paddingEnd: 20,
    paddingVertical: 12
  },
  optionOrderIcon: {
    paddingStart: 4,
    paddingEnd: 20,
    paddingVertical: 12
  },
  separator: { marginStart: 56, borderBottomWidth: 1, borderColor: Colors.WHITE_016 }
});

export default QuestionRenderer;
