import mongoose from 'mongoose'

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    fileName: {
        type: String,
        default: 'resume.pdf'
    },
    resumeText: {
        type: String,
        default: ''
    },
    jobDescription: {
        type: String,
        default: ''
    },
    atsScore: {
        type: Number,
        default: 0
    },
    atsBreakdown: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    qualityScore: {
        type: Number,
        default: 0
    },
    qualityAnalysis: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    predictedRole: {
        type: String,
        default: 'Software Engineer'
    },
    predictedRoles: {
        type: Array,
        default: []
    },
    matchedSkills: {
        type: [String],
        default: []
    },
    missingSkills: {
        type: [String],
        default: []
    },
    skillGaps: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    matchedJobs: {
        type: Array,
        default: []
    },
    recommendations: {
        type: Array,
        default: []
    },
    resumeImprovements: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    sectionAnalysis: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    projectAnalysis: {
        type: Array,
        default: []
    },
    interviewPrep: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    careerRoadmap: {
        type: Array,
        default: []
    },
    learningPriorities: {
        type: Array,
        default: []
    },
    summaries: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    feedback: {
        type: String,
        default: ''
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

const Resume = mongoose.model('Resume', resumeSchema)

export default Resume