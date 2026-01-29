import React from 'react';

const ProfileCardComponent = ({
  avatarUrl = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
  className = '',
  name = 'Developer',
  title = 'Software Engineer',
  handle = 'developer',
  techStack = [],
  rating = 0,
  experience = '0 years',
  miniAvatarUrl
}) => {
  const cardRadius = '30px';

  return (
    <div className={`relative transition-all duration-300 ease-out hover:z-[100] ${className}`.trim()}>
      <div className="relative z-[1] group">
        <section
          className="relative overflow-hidden transition-all duration-300 ease-out group-hover:scale-110"
          style={{
            height: '80svh',
            maxHeight: '540px',
            aspectRatio: '0.718',
            borderRadius: cardRadius,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              borderRadius: cardRadius,
              display: 'grid',
              gridArea: '1 / -1'
            }}
          >
            {/* Avatar content */}
            <div
              className="overflow-visible"
              style={{
                gridArea: '1 / -1',
                borderRadius: cardRadius,
                pointerEvents: 'none'
              }}
            >
              <img
                className="w-full absolute left-1/2 bottom-[-1px] will-change-transform transition-transform duration-[120ms] ease-out object-cover"
                src={avatarUrl}
                alt={`${name || 'User'} avatar`}
                loading="lazy"
                style={{
                  transform: 'translateX(-50%)',
                  borderRadius: cardRadius,
                  objectPosition: 'center top',
                  height: '100%'
                }}
                onError={e => {
                  const t = e.target;
                  t.style.display = 'none';
                }}
              />
              
              {/* Info card at bottom */}
              <div
                className="absolute z-[2] backdrop-blur-[30px] border border-white/10 pointer-events-auto"
                style={{
                  '--ui-inset': '20px',
                  '--ui-radius-bias': '6px',
                  bottom: 'var(--ui-inset)',
                  left: 'var(--ui-inset)',
                  right: 'var(--ui-inset)',
                  background: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: 'calc(max(0px, var(--card-radius) - var(--ui-inset) + var(--ui-radius-bias)))',
                  padding: '16px'
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="rounded-full overflow-hidden border border-white/10 flex-shrink-0"
                    style={{ width: '48px', height: '48px' }}
                  >
                    <img
                      className="w-full h-full object-cover rounded-full"
                      src={miniAvatarUrl || avatarUrl}
                      alt={`${name || 'User'} mini avatar`}
                      loading="lazy"
                      style={{ display: 'block', gridArea: 'auto', borderRadius: '50%', pointerEvents: 'auto' }}
                      onError={e => {
                        const t = e.target;
                        t.style.opacity = '0.5';
                        t.src = avatarUrl;
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-semibold text-white/90 leading-tight">@{handle}</div>
                    <div className="text-sm text-white/60 leading-tight mt-1">{experience}</div>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700/50">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span className="text-sm font-bold text-white">{rating}</span>
                  </div>
                </div>
                
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5">
                  {techStack.slice(0, 4).map((tech, idx) => (
                    <span 
                      key={idx}
                      className="text-xs px-2 py-1 bg-white/10 text-white/80 rounded border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                  {techStack.length > 4 && (
                    <span className="text-xs px-2 py-1 bg-white/10 text-white/60 rounded border border-white/10">
                      +{techStack.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Details content - Name and Title at top */}
            <div
              className="max-h-full overflow-hidden text-center relative z-[5]"
              style={{
                gridArea: '1 / -1',
                borderRadius: cardRadius,
                pointerEvents: 'none'
              }}
            >
              <div className="w-full absolute flex flex-col" style={{ top: '3em', display: 'flex', gridArea: 'auto' }}>
                <h3
                  className="font-semibold m-0 text-white"
                  style={{
                    fontSize: 'min(5svh, 3em)',
                    display: 'block',
                    gridArea: 'auto',
                    borderRadius: '0',
                    pointerEvents: 'auto'
                  }}
                >
                  {name}
                </h3>
                <p
                  className="font-semibold whitespace-nowrap mx-auto w-min text-gray-300"
                  style={{
                    position: 'relative',
                    top: '-12px',
                    fontSize: '16px',
                    margin: '0 auto',
                    display: 'block',
                    gridArea: 'auto',
                    borderRadius: '0',
                    pointerEvents: 'auto'
                  }}
                >
                  {title}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;