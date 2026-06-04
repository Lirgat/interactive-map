import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './styles/PhylogenyChart.css';

const PhylogenyChart = ({ onClose }) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Данные для филогенетического дерева H5N1 в России
  const treeData = {
    name: "Вспышки H5N1 в России",
    children: [
      {
        name: "Центральный федеральный округ",
        host: "Птица",
        year: 2024,
        cases: 145,
        genotype: "2.3.4.4b",
        children: [
          { 
            name: "Московская область", 
            genotype: "2.3.4.4b",
            mutations: ["HA1: A83D", "HA1: A36T"],
            host: "Птица",
            year: 2024,
            cases: 78
          },
          { 
            name: "Владимирская область", 
            genotype: "2.3.4.4b",
            mutations: ["HA1: T36A", "HA1: K325R"],
            host: "Птица",
            year: 2024,
            cases: 34
          },
          { 
            name: "Тверская область", 
            genotype: "2.3.4.4b",
            mutations: ["HA1: A83D", "HA2: N149D"],
            host: "Птица",
            year: 2024,
            cases: 33
          }
        ]
      },
      {
        name: "Южный федеральный округ",
        host: "Птица",
        year: 2025,
        cases: 234,
        genotype: "2.3.4.4b",
        children: [
          { 
            name: "Краснодарский край", 
            genotype: "2.3.4.4b",
            mutations: ["HA1: Y123M", "HA1: D88G"],
            host: "Птица",
            year: 2025,
            cases: 89
          },
          { 
            name: "Ростовская область", 
            genotype: "2.3.4.4b",
            mutations: ["HA1: L104M", "HA1: L115Q"],
            host: "Птица",
            year: 2025,
            cases: 67
          },
          { 
            name: "Волгоградская область", 
            genotype: "2.3.4.4b",
            mutations: ["HA1: V210A"],
            host: "Птица",
            year: 2025,
            cases: 45
          },
          { 
            name: "Астраханская область", 
            genotype: "2.3.4.4b",
            mutations: ["HA1: T195I", "HA2: I184V"],
            host: "Птица",
            year: 2025,
            cases: 33
          }
        ]
      },
      {
        name: "Приволжский федеральный округ",
        host: "Птица, Свиньи",
        year: 2025,
        cases: 167,
        genotype: "2.3.4.4b",
        children: [
          { 
            name: "Татарстан", 
            genotype: "2.3.4.4b",
            mutations: ["HA1: S320N"],
            host: "Птица",
            year: 2025,
            cases: 56
          },
          { 
            name: "Нижегородская область", 
            genotype: "2.3.4.4b",
            mutations: ["HA1: D88G", "HA1: S320N"],
            host: "Птица",
            year: 2025,
            cases: 45
          },
          { 
            name: "Самарская область", 
            genotype: "2.3.4.4b",
            mutations: ["HA1: A83D"],
            host: "Свиньи",
            year: 2025,
            cases: 34
          },
          { 
            name: "Саратовская область", 
            genotype: "2.3.4.4b",
            mutations: ["HA1: T36A"],
            host: "Птица",
            year: 2025,
            cases: 32
          }
        ]
      },
      {
        name: "Северо-Западный федеральный округ",
        host: "Птица",
        year: 2025,
        cases: 98,
        genotype: "2.3.4.4b",
        children: [
          { 
            name: "Ленинградская область", 
            genotype: "2.3.4.4b",
            mutations: ["HA1: Y123M"],
            host: "Птица",
            year: 2025,
            cases: 45
          },
          { 
            name: "Калининградская область", 
            genotype: "2.3.4.4b",
            mutations: ["HA1: L104M"],
            host: "Птица",
            year: 2025,
            cases: 28
          },
          { 
            name: "Псковская область", 
            genotype: "2.3.4.4b",
            mutations: ["HA1: D88G"],
            host: "Птица",
            year: 2025,
            cases: 25
          }
        ]
      },
      {
        name: "Уральский федеральный округ",
        host: "Птица",
        year: 2026,
        cases: 156,
        genotype: "2.3.4.4b",
        children: [
          { 
            name: "Свердловская область", 
            genotype: "2.3.4.4b",
            mutations: ["HA1: T36A", "HA1: K325R", "HA2: N149D"],
            host: "Птица",
            year: 2026,
            cases: 67
          },
          { 
            name: "Челябинская область", 
            genotype: "2.3.4.4b",
            mutations: ["HA1: A83D", "HA1: L115Q"],
            host: "Птица",
            year: 2026,
            cases: 45
          },
          { 
            name: "Тюменская область", 
            genotype: "2.3.4.4b",
            mutations: ["HA1: V210A"],
            host: "Птица",
            year: 2026,
            cases: 44
          }
        ]
      },
      {
        name: "Сибирский федеральный округ",
        host: "Птица",
        year: 2026,
        cases: 89,
        genotype: "2.3.4.4b",
        children: [
          { 
            name: "Новосибирская область", 
            genotype: "2.3.4.4b",
            mutations: ["HA1: S320N"],
            host: "Птица",
            year: 2026,
            cases: 34
          },
          { 
            name: "Красноярский край", 
            genotype: "2.3.4.4b",
            mutations: ["HA1: T195I", "HA2: I184V"],
            host: "Птица",
            year: 2026,
            cases: 28
          },
          { 
            name: "Иркутская область", 
            genotype: "2.3.4.4b",
            mutations: ["HA1: D88G"],
            host: "Птица",
            year: 2026,
            cases: 27
          }
        ]
      },
      {
        name: "Дальневосточный федеральный округ",
        host: "Птица",
        year: 2026,
        cases: 67,
        genotype: "2.3.4.4b",
        children: [
          { 
            name: "Приморский край", 
            genotype: "2.3.4.4b",
            mutations: ["HA1: L104M"],
            host: "Птица",
            year: 2026,
            cases: 34
          },
          { 
            name: "Хабаровский край", 
            genotype: "2.3.4.4b",
            mutations: ["HA1: Y123M"],
            host: "Птица",
            year: 2026,
            cases: 33
          }
        ]
      }
    ]
  };

  // Цвета для разных видов хозяев и округов
  const hostColors = {
    "Птица": "#e74c3c",
    "Птица, Свиньи": "#e67e22",
    "Свиньи": "#f1c40f",
    "Центральный федеральный округ": "#3498db",
    "Южный федеральный округ": "#2ecc71",
    "Приволжский федеральный округ": "#9b59b6",
    "Северо-Западный федеральный округ": "#1abc9c",
    "Уральский федеральный округ": "#e84393",
    "Сибирский федеральный округ": "#f39c12",
    "Дальневосточный федеральный округ": "#16a085"
  };

  // Функция отрисовки дерева
  const drawTree = () => {
    if (!svgRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth - 40;
    const height = 500;
    const margin = { top: 30, right: 30, bottom: 30, left: 200 };

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("cursor", isDragging ? "grabbing" : "grab");

    const mainGroup = svg.append("g")
      .attr("class", "zoom-group")
      .attr("transform", `translate(${transform.x},${transform.y}) scale(${transform.k})`);

    const root = d3.hierarchy(treeData);
    const treeLayout = d3.tree().size([height - margin.top - margin.bottom, width - margin.left - margin.right]);
    const treeDataLayout = treeLayout(root);

    // Рисуем линии
    mainGroup.selectAll(".link")
      .data(treeDataLayout.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#bbb")
      .attr("stroke-width", 1.5)
      .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x)
      );

    // Рисуем узлы
    const nodes = mainGroup.selectAll(".node")
      .data(treeDataLayout.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.y},${d.x})`)
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d.data);
      })
      .on("mouseenter", (event, d) => {
        d3.select(event.currentTarget).select("circle").attr("r", 8);
      })
      .on("mouseleave", (event, d) => {
        d3.select(event.currentTarget).select("circle").attr("r", 5);
      });

    // Кружки для узлов (разный размер для округов и регионов)
    nodes.append("circle")
      .attr("r", d => d.children ? 7 : 5)
      .attr("fill", d => {
        if (hostColors[d.data.name]) return hostColors[d.data.name];
        if (d.data.host && hostColors[d.data.host]) return hostColors[d.data.host];
        if (d.children) return "#007aff";
        return "#e74c3c";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Названия
    nodes.append("text")
      .attr("dy", ".35em")
      .attr("x", d => d.children ? -12 : 10)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .style("font-size", d => d.children ? "11px" : "10px")
      .style("font-weight", d => d.children ? "bold" : "normal")
      .text(d => {
        if (d.data.name) return d.data.name;
        return "";
      });

    // Всплывающие подсказки
    nodes.append("title")
      .text(d => {
        let info = `${d.data.name || "Узел"}\n`;
        if (d.data.genotype) info += `Генотип: ${d.data.genotype}\n`;
        if (d.data.host) info += `Хозяин: ${d.data.host}\n`;
        if (d.data.year) info += `Год: ${d.data.year}\n`;
        if (d.data.cases) info += `Случаев: ${d.data.cases}\n`;
        if (d.data.mutations) info += `Мутации: ${d.data.mutations.join(", ")}`;
        return info;
      });
  };

  // Обработчики для панорамирования
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    d3.select(svgRef.current).style("cursor", "grabbing");
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setTransform({ ...transform, x: newX, y: newY });
    
    const zoomGroup = d3.select(svgRef.current).select(".zoom-group");
    if (!zoomGroup.empty()) {
      zoomGroup.attr("transform", `translate(${newX},${newY}) scale(${transform.k})`);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    d3.select(svgRef.current).style("cursor", "grab");
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      d3.select(svgRef.current).style("cursor", "grab");
    }
  };

  useEffect(() => {
    drawTree();
  }, [transform]);

  const handleZoomIn = () => {
    const newK = Math.min(transform.k + 0.2, 3);
    setTransform({ ...transform, k: newK });
  };

  const handleZoomOut = () => {
    const newK = Math.max(transform.k - 0.2, 0.5);
    setTransform({ ...transform, k: newK });
  };

  const handleReset = () => {
    setTransform({ x: 0, y: 0, k: 1 });
  };

  return (
    <div className="phylogeny-overlay">
      <div className="phylogeny-modal">
        <div className="phylogeny-header">
          <h2>Филодинамика вспышки H5N1 в Российской Федерации</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="phylogeny-stats">
          <div className="stat">
            <span className="stat-label">Всего изолятов:</span>
            <span className="stat-value">956</span>
          </div>
          <div className="stat">
            <span className="stat-label">Период:</span>
            <span className="stat-value">2024 - 2026</span>
          </div>
          <div className="stat">
            <span className="stat-label">Доминирующий генотип:</span>
            <span className="stat-value">2.3.4.4b</span>
          </div>
        </div>

        <div className="phylogeny-content">
          <div className="legend-panel">
            <h4>Федеральные округа</h4>
            <div className="legend-items">
              <div className="legend-item"><div className="legend-color" style={{background: "#3498db"}}></div><span>Центральный</span></div>
              <div className="legend-item"><div className="legend-color" style={{background: "#2ecc71"}}></div><span>Южный</span></div>
              <div className="legend-item"><div className="legend-color" style={{background: "#9b59b6"}}></div><span>Приволжский</span></div>
              <div className="legend-item"><div className="legend-color" style={{background: "#1abc9c"}}></div><span>Северо-Западный</span></div>
              <div className="legend-item"><div className="legend-color" style={{background: "#e84393"}}></div><span>Уральский</span></div>
              <div className="legend-item"><div className="legend-color" style={{background: "#f39c12"}}></div><span>Сибирский</span></div>
              <div className="legend-item"><div className="legend-color" style={{background: "#16a085"}}></div><span>Дальневосточный</span></div>
            </div>
            <div className="legend-divider"></div>
            <h4>Поражённые виды</h4>
            <div className="legend-items">
              <div className="legend-item"><div className="legend-color" style={{background: "#e74c3c"}}></div><span>Птица</span></div>
              <div className="legend-item"><div className="legend-color" style={{background: "#e67e22"}}></div><span>Птица и свиньи</span></div>
              <div className="legend-item"><div className="legend-color" style={{background: "#f1c40f"}}></div><span>Свиньи</span></div>
            </div>
          </div>

          <div className="chart-container" ref={containerRef}>
            <svg 
              ref={svgRef} 
              className="phylogeny-svg"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: "grab" }}
            ></svg>
          </div>

          <div className="annotations-panel">
            <h4>Характерные мутации</h4>
            <div className="annotations-list">
              <div className="annotation-item">HA1: A83D (Московская обл.)</div>
              <div className="annotation-item">HA1: A36T (Владимирская обл.)</div>
              <div className="annotation-item">HA1: T36A, K325R (Краснодарский край)</div>
              <div className="annotation-item">HA1: Y123M (Ростовская обл.)</div>
              <div className="annotation-item">HA1: L104M, L115Q (Татарстан)</div>
              <div className="annotation-item">HA1: V210A (Самарская обл.)</div>
              <div className="annotation-item">HA1: D88G, S320N (Свердловская обл.)</div>
            </div>
          </div>
        </div>

        {selectedNode && (
          <div className="node-details">
            <div className="node-details-header">
              <h4>Информация об очаге</h4>
              <button className="close-details" onClick={() => setSelectedNode(null)}>×</button>
            </div>
            <div className="node-details-content">
              <p><strong>Регион:</strong> {selectedNode.name}</p>
              {selectedNode.genotype && <p><strong>Генотип:</strong> {selectedNode.genotype}</p>}
              {selectedNode.host && <p><strong>Поражённые виды:</strong> {selectedNode.host}</p>}
              {selectedNode.year && <p><strong>Год регистрации:</strong> {selectedNode.year}</p>}
              {selectedNode.cases && <p><strong>Количество случаев:</strong> {selectedNode.cases}</p>}
              {selectedNode.mutations && (
                <p><strong>Мутации:</strong> {selectedNode.mutations.join(", ")}</p>
              )}
            </div>
          </div>
        )}

        <div className="phylogeny-footer">
          <button className="zoom-btn" onClick={handleZoomIn}>Приблизить +</button>
          <button className="zoom-btn" onClick={handleZoomOut}>Отдалить -</button>
          <button className="zoom-btn" onClick={handleReset}>Сбросить</button>
          <span className="pan-hint">⇨ Перемещайте карту зажатой левой кнопкой мыши</span>
        </div>
      </div>
    </div>
  );
};

export default PhylogenyChart;
