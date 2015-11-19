window.c.ProjectSidebar = (function(m, h, c) {
    return {
        controller: function(args) {
            var project = args.project,
                animateProgress = (el, isInitialized) => {
                    if (!isInitialized) {
                        let animation, progress = 0,
                            pledged = 0,
                            contributors = 0,
                            pledgedIncrement = project.pledged / project.progress,
                            contributorsIncrement = project.total_contributors / project.progress;

                        const progressBar = document.getElementById('progressBar'),
                            pledgedEl = document.getElementById('pledged'),
                            contributorsEl = document.getElementById('contributors'),
                            animate = () => {
                                animation = setInterval(incrementProgress, 28);
                            },
                            incrementProgress = () => {
                                if (progress <= parseInt(project.progress)) {
                                    progressBar.style.width = `${progress}%`;
                                    pledgedEl.innerText = `R$ ${h.formatNumber(pledged)}`;
                                    contributorsEl.innerText = `${parseInt(contributors)} pessoas`;
                                    el.innerText = `${progress}%`;
                                    pledged = pledged + pledgedIncrement;
                                    contributors = contributors + contributorsIncrement;
                                    progress = progress + 1;
                                } else {
                                    clearInterval(animation);
                                }
                            };
                        setTimeout(() => {
                            animate();
                        }, 1800);

                    }
                },
                displayCardClass = function() {
                    var states = {
                        'waiting_funds': 'card-waiting',
                        'successful': 'card-success',
                        'failed': 'card-error',
                        'draft': 'card-dark',
                        'in_analysis': 'card-dark',
                        'approved': 'card-dark'
                    };

                    return (states[project.state] ? 'card u-radius zindex-10 ' + states[project.state] : '');
                },
                displayStatusText = function() {
                    var states = {
                        'approved': 'Esse projeto já foi aprovado pelo Catarse. Em breve ele entrará no ar e estará pronto para receber apoios.',
                        'online': h.existy(project.zone_expires_at) ? 'Você pode apoiar este projeto até o dia ' + h.momentify(project.zone_expires_at) + ' às 23h59m59s' : '',
                        'failed': 'Este projeto não atingiu o mínimo de R$ ' + h.formatNumber(project.goal) + ' até ' + h.momentify(project.zone_expires_at) + ' e não foi financiado',
                        'rejected': 'Este projeto não foi aceito. Não é possível realizar um apoio.',
                        'in_analysis': 'Este projeto está em análise e ainda não está aberto para receber apoios.',
                        'successful': 'Este projeto foi financiado em ' + h.momentify(project.zone_expires_at),
                        'waiting_funds': 'O prazo de captação desse projeto está encerrado. Estamos aguardando a confirmação dos últimos pagamentos.',
                        'draft': 'Este projeto é apenas um rascunho e ainda não pode receber apoios.'
                    };

                    return states[project.state];
                };

            return {
                animateProgress: animateProgress,
                displayCardClass: displayCardClass,
                displayStatusText: displayStatusText
            };
        },

        view: function(ctrl, args) {
            var project = args.project,
                elapsed = h.translatedTime(project.elapsed_time),
                remaining = h.translatedTime(project.remaining_time);

            return m('#project-sidebar.aside', [
                m('.project-stats', [
                    m('.project-stats-inner', [
                        m('.project-stats-info', [
                            m('.u-marginbottom-20', [
                                m('#pledged.fontsize-largest.fontweight-semibold.u-text-center-small-only', `R$ ${h.formatNumber(project.pledged)}`),
                                m('.fontsize-small.u-text-center-small-only', ['apoiados por ', m('span#contributors.fontweight-semibold', `${parseInt(project.total_contributors)} pessoas`), !remaining.total ? ` em ${elapsed.total} ${elapsed.unit}` : ''])
                            ]),
                            m('.meter', [
                                m('#progressBar.meter-fill', {
                                    style: {
                                        width: `${project.progress}%`
                                    }
                                })
                            ]),
                            m('.w-row.u-margintop-10', [
                                m('.w-col.w-col-5.w-col-small-6.w-col-tiny-6', [
                                    m('.fontsize-small.fontweight-semibold.lineheight-tighter', `${parseInt(project.progress)}%`)
                                ]),
                                m('.w-col.w-col-7.w-col-small-6.w-col-tiny-6.w-clearfix', [
                                    m('.u-right.fontsize-small.lineheight-tighter', remaining.total ? [
                                        m('span.fontweight-semibold', remaining.total), ` ${remaining.unit} restantes`
                                    ] : '')
                                ])
                            ])
                        ]),
                        m('.w-row', [
                            m.component(c.ProjectMode, {
                                project: project
                            })
                        ])
                    ])
                    , (project.open_for_contributions ? m('a#contribute_project_form.btn.btn-large.u-marginbottom-20[href="/projects/' + project.id + '/contributions/new"]', 'Apoiar este projeto') : ''), ((project.open_for_contributions) ? m.component(c.ProjectReminder, {
                        project: project
                    }) : ''),
                    m('div[class="fontsize-smaller u-marginbottom-30 ' + (ctrl.displayCardClass()) + '"]', ctrl.displayStatusText())
                ]),
                m('.user-c', m.component(c.ProjectUserCard, {
                    userDetails: args.userDetails
                }))
            ]);
        }
    };
}(window.m, window.c.h, window.c));
