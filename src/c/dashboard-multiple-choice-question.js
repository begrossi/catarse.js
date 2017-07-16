import m from 'mithril';
import _ from 'underscore';
import surveyVM from '../vms/survey-vm';

const dashboardMultipleChoiceQuestion = {
    controller(args) {
        const { question } = args;
        const deleteOption = (question, idx) => () => {
            surveyVM.deleteMultipleQuestionOption(question, idx);

            return false;
        };

        const addOption = question => () => {
            surveyVM.addMultipleQuestionOption(question);

            return false;
        };

        const updateOption = idToUpdate => (newValue) => {
            const survey_question_choices_attributes = _.map(question.survey_question_choices_attributes(), (option, id) => {
                if (id === idToUpdate) {
                    return { option: newValue };
                }

                return option;
            });

            question.survey_question_choices_attributes(survey_question_choices_attributes);
        };

        return {
            addOption,
            deleteOption,
            updateOption
        };
    },
    view(ctrl, args) {
        const { question, index } = args;

        return m('.card.u-marginbottom-30.u-radius.w-form', [
            m('.dashboard-question', [
                m('.w-row', [
                    m('.w-col.w-col-4',
                            m('label.fontsize-smaller',
                                'Pergunta'
                            )
                        ),
                    m('.w-col.w-col-8',
                            m('input.positive.text-field.w-input[type="text"]', {
                                name: `reward[surveys_attributes][questions][${index}][question]`,
                                onchange: m.withAttr('value', newValue => question.question = newValue),
                                value: question.question
                            })
                        )
                ]),
                m('.w-row', [
                    m('.w-col.w-col-4',
                            m('label.fontsize-smaller[for="name-3"]',
                                'Descrição'
                            )
                        ),
                    m('.w-col.w-col-8',
                            m('input.positive.text-field.w-input[type="text"]', {
                                onchange: m.withAttr('value', newValue => question.description = newValue),
                                name: `reward[surveys_attributes][questions][${index}][description]`
                            })
                        )
                ]),
                m('.w-row', [
                    m('.w-col.w-col-4',
                            m('label.fontsize-smaller',
                                'Opções'
                            )
                        ),
                    m('.w-col.w-col-8', [
                        _.map(question.survey_question_choices_attributes(), (option, idx) => m('.w-row', [
                            m('.fa.fa-circle-o.fontcolor-terciary.prefix.u-text-center.w-col.w-col-1.w-col-medium-1.w-col-small-1.w-col-tiny-1'),
                            m('.w-col.w-col-10.w-col-medium-10.w-col-small-10.w-col-tiny-10',
                                    m('input.positive.text-field.w-input[type="text"]', {
                                        onchange: m.withAttr('value', ctrl.updateOption(idx)),
                                        name: `reward[surveys_attributes][questions][${index}][question][survey_question_choices_attributes][${idx}][option]`,
                                        value: option.option
                                    })
                                ),
                            m('.w-col.w-col-1.w-col-medium-1.w-col-small-1.w-col-tiny-1',
                                    m('button.btn.btn-medium.btn-no-border.btn-terciary.fa.fa-trash', {
                                        onclick: ctrl.deleteOption(question, idx)
                                    })
                                )
                        ])),
                        m('.w-row', [
                            m('.w-col.w-col-1.w-col-medium-1.w-col-small-1.w-col-tiny-1'),
                            m('.w-col.w-col-11.w-col-medium-11.w-col-small-11.w-col-tiny-11',
                                    m('button.fontcolor-secondary.fontsize-smallest.link-hidden',
                                        { onclick: ctrl.addOption(question) },
                                        'Adicionar mais uma opção'
                                    )
                                )
                        ])
                    ])
                ])
            ])
        ]);
    }
};

export default dashboardMultipleChoiceQuestion;
