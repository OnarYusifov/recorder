const { createCanvas } = require('canvas');

class CanvasGenerator {
    async generateTalkTimeCanvas(recordingData) {
        const { users, userTalkTime, teamName, startTime, endTime } = recordingData;

        // Canvas dimensions
        const width = 800;
        const height = 600;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#2C2F33';
        ctx.fillRect(0, 0, width, height);

        // Title
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Talk Time Statistics - ${teamName}`, width / 2, 50);

        // Subtitle with duration
        const duration = Math.floor((endTime - startTime) / 1000);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        ctx.font = '16px Arial';
        ctx.fillStyle = '#99AAB5';
        ctx.fillText(`Total Duration: ${minutes}m ${seconds}s`, width / 2, 80);

        // Calculate total talk time
        let totalTalkTime = 0;
        for (const time of userTalkTime.values()) {
            totalTalkTime += time;
        }

        // If no talk time recorded, show message
        if (totalTalkTime === 0 || users.size === 0) {
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '20px Arial';
            ctx.fillText('No talk time recorded', width / 2, height / 2);
            return canvas.toBuffer('image/png');
        }

        // Sort users by talk time
        const sortedUsers = Array.from(users.entries())
            .map(([userId, username]) => ({
                userId,
                username,
                talkTime: userTalkTime.get(userId) || 0,
            }))
            .sort((a, b) => b.talkTime - a.talkTime);

        // Bar chart
        const chartStartY = 120;
        const chartHeight = height - chartStartY - 100;
        const barSpacing = 20;
        const barWidth = (width - 100) / sortedUsers.length - barSpacing;
        const maxBarHeight = chartHeight - 50;

        // Find max talk time for scaling
        const maxTalkTime = Math.max(...sortedUsers.map(u => u.talkTime));

        // Draw bars
        sortedUsers.forEach((user, index) => {
            const x = 50 + (barWidth + barSpacing) * index;
            const percentage = (user.talkTime / totalTalkTime) * 100;
            const barHeight = (user.talkTime / maxTalkTime) * maxBarHeight;
            const y = chartStartY + maxBarHeight - barHeight;

            // Bar
            const colors = ['#7289DA', '#43B581', '#FAA61A', '#F04747', '#9B59B6'];
            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(x, y, barWidth, barHeight);

            // Border
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, barWidth, barHeight);

            // Talk time (above bar)
            const talkSeconds = Math.floor(user.talkTime / 1000);
            const talkMinutes = Math.floor(talkSeconds / 60);
            const talkSecondsRemainder = talkSeconds % 60;
            const timeText = talkMinutes > 0 
                ? `${talkMinutes}m ${talkSecondsRemainder}s`
                : `${talkSecondsRemainder}s`;

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(timeText, x + barWidth / 2, y - 10);

            // Percentage
            ctx.font = '12px Arial';
            ctx.fillStyle = '#99AAB5';
            ctx.fillText(`${percentage.toFixed(1)}%`, x + barWidth / 2, y - 28);

            // Username (below chart)
            ctx.save();
            ctx.translate(x + barWidth / 2, chartStartY + maxBarHeight + 20);
            ctx.rotate(-Math.PI / 4);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '14px Arial';
            ctx.fillText(user.username, 0, 0);
            ctx.restore();
        });

        // Legend / Summary at bottom
        const summaryY = height - 60;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px Arial';
        ctx.fillText(`Total Participants: ${users.size}`, width / 2, summaryY);

        const avgTalkTime = totalTalkTime / users.size;
        const avgSeconds = Math.floor(avgTalkTime / 1000);
        const avgMinutes = Math.floor(avgSeconds / 60);
        const avgSecondsRemainder = avgSeconds % 60;
        ctx.fillText(
            `Average Talk Time: ${avgMinutes}m ${avgSecondsRemainder}s`,
            width / 2,
            summaryY + 20
        );

        return canvas.toBuffer('image/png');
    }
}

module.exports = CanvasGenerator;

